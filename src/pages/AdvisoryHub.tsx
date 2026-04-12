import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Sprout, Newspaper, PlaySquare, RefreshCw, Search, Mic, MapPin, Star, Phone, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useDialect } from "@/lib/use-dialect";
import { getDialectForState } from "@/lib/dialect-translator";
// Services & Data
import { ALL_SCHEMES } from "@/services/schemesData";
import { getEligibleSchemes } from "@/services/schemeEngine";
import { fetchFarmingNews } from "@/services/newsService";
import { fetchFarmingVideos } from "@/services/youtubeService";
import { FarmerProfile, Scheme, NewsArticle, Video } from "@/types/advisory";
import { useAuthStore } from "@/store/authStore";
import { getProfileLocation } from "@/lib/profile-utils";

// Components
import { SchemeCard } from "@/components/Advisory/SchemeCard";
import { NewsCard } from "@/components/Advisory/NewsCard";
import { VideoCard } from "@/components/Advisory/VideoCard";
import { NearbySuppliersMap } from "@/components/NearbySuppliersMap";
const OfflineFertilizerCalculator = lazy(() => import("@/components/OfflineFertilizerCalculator"));

// ... components

const AdvisoryHub = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuthStore();
    const { dialect } = useDialect();
    const language: "Hindi" | "English" = i18n.language === 'hi' ? "Hindi" : "English";

    // State
    const [activeTab, setActiveTab] = useState("schemes");
    const [schemes, setSchemes] = useState<Scheme[]>([]);
    const [aiSchemes, setAiSchemes] = useState<Scheme[]>([]); // New state for AI-fetched schemes
    const [loadingAiSchemes, setLoadingAiSchemes] = useState(false);
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [videos, setVideos] = useState<Video[]>([]);
    const [loadingNews, setLoadingNews] = useState(false);
    const [loadingVideos, setLoadingVideos] = useState(false);
    const [newsPage, setNewsPage] = useState(1);
    const [videoNextToken, setVideoNextToken] = useState<string | undefined>(undefined);

    // Pagination & Load More
    const [visibleCount, setVisibleCount] = useState(9); // Start with 9 items
    const [visibleNewsCount, setVisibleNewsCount] = useState(9); // News starts with 9

    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [nearbySuppliers, setNearbySuppliers] = useState<any[]>([]);
    const [loadingSuppliers, setLoadingSuppliers] = useState(false);

    // Farmer Profile State
    const [profile, setProfile] = useState<FarmerProfile>({
        state: localStorage.getItem(`profile_${user?.email}_state`) || "Bihar",
        landSize: Number(localStorage.getItem(`profile_${user?.email}_farmSize`)) || 2.5,
        farmerType: (localStorage.getItem(`profile_${user?.email}_farmerType`) as any) || "Small",
        name: user?.name || "Kisan Bhai"
    });

    // Effects for Caching & Data
    useEffect(() => {
        const fetchSchemes = async () => {
            if (!navigator.onLine) {
                // Offline Mode: Load from Cache
                const cached = localStorage.getItem('cachedSchemes');
                if (cached) {
                    setSchemes(JSON.parse(cached));
                    toast.info(t('advisoryHub.offline.loadedCache') || "Offline: Loaded schemes from cache.");
                }
                return;
            }

            // Online Mode
            const eligible = getEligibleSchemes(profile, ALL_SCHEMES);
            setSchemes(eligible);

            // Save to Cache
            localStorage.setItem('cachedSchemes', JSON.stringify(eligible));
        };

        fetchSchemes();
    }, [profile]); // Refresh when profile changes

    const handleLoadMoreSchemes = async () => {
        // If we have hidden schemes already loaded, just show them
        if (visibleCount < schemes.length) {
            setVisibleCount(prev => prev + 9);
            return;
        }

        // Otherwise, fetch NEW schemes from AI
        setLoadingAiSchemes(true);
        toast.info(t('advisoryHub.loading.askingAi') || "Asking AI for more schemes...");
        try {
            const { fetchLatestSchemes } = await import("../services/aiSchemeService");
            const newSchemes = await fetchLatestSchemes(language);

            // Filter duplicates based on ID or Name
            const currentIds = new Set(schemes.map(s => s.id));
            const uniqueNew = newSchemes.filter(s => !currentIds.has(s.id));

            if (uniqueNew.length > 0) {
                setAiSchemes(prev => [...prev, ...uniqueNew]);
                // visibleCount will effectively increase because schemes length increases, 
                // but we might want to forcefully show the new ones.
                // Since useEffect updates 'schemes', and we render slice(0, visibleCount),
                // we should increase visibleCount to accommodate the new items.
                setVisibleCount(prev => prev + uniqueNew.length);
                toast.success(t('advisoryHub.success.addedSchemes', { count: uniqueNew.length }));
            } else {
                toast.info(t('advisoryHub.info.noNewSchemes'));
            }
        } catch (error) {
            console.error(error);
            toast.error(t('advisoryHub.error.loadSchemes'));
        } finally {
            setLoadingAiSchemes(false);
        }
    };

    // ... (handleRefresh etc)

    // In Render:


    // ...

    // Language State removed (mapped from i18n above)


    useEffect(() => {
        const eligible = getEligibleSchemes(profile, ALL_SCHEMES);
        setSchemes([...eligible, ...aiSchemes]);
    }, [profile, aiSchemes]);

    useEffect(() => {
        const loadAiSchemes = async () => {
            setLoadingAiSchemes(true);
            try {
                const { fetchLatestSchemes } = await import("../services/aiSchemeService");
                const fetched = await fetchLatestSchemes(language);
                setAiSchemes(fetched);
            } catch (err) {
                console.error("Failed to load AI schemes", err);
            } finally {
                setLoadingAiSchemes(false);
            }
        };
        loadAiSchemes();
    }, [language]);

    const fetchSuppliers = (lat: number, lng: number) => {
        setLoadingSuppliers(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        fetch(`${API_URL}/nearby-suppliers?lat=${lat}&lng=${lng}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setNearbySuppliers(data);
            })
            .catch(err => console.error("Failed to fetch suppliers", err))
            .finally(() => setLoadingSuppliers(false));
    };

    const fetchSuppliersByAddress = (address: string) => {
        setLoadingSuppliers(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        fetch(`${API_URL}/nearby-suppliers?address=${encodeURIComponent(address)}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setNearbySuppliers(data);
            })
            .catch(err => console.error("Failed to fetch suppliers", err))
            .finally(() => setLoadingSuppliers(false));
    };

    const handleGetLocation = () => {
        const profileLoc = getProfileLocation(user?.email);
        
        // 1. Fetch by profile address immediately if available
        if (profileLoc?.fullAddress && nearbySuppliers.length === 0) {
            fetchSuppliersByAddress(profileLoc.fullAddress);
        }

        // 2. Request precision GPS in background
        if (!navigator.geolocation) {
            if (!profileLoc?.fullAddress) {
                toast.error("Geolocation not supported and no profile address found.");
            }
            return;
        }

        setLoadingSuppliers(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                // Precise GPS overrides profile baseline
                fetchSuppliers(pos.coords.latitude, pos.coords.longitude);
            },
            (err) => {
                console.error("GPS Error:", err);
                if (!profileLoc?.fullAddress) {
                    setLoadingSuppliers(false);
                    toast.error("Please enable location or set your profile address.");
                } else {
                    setLoadingSuppliers(false);
                }
            },
            { timeout: 8000 }
        );
    };

    // Auto-fetch suppliers when tab is opened
    useEffect(() => {
        if (activeTab === 'suppliers' && nearbySuppliers.length === 0) {
            handleGetLocation();
        }
    }, [activeTab]);

    // Fetch Data Effects - News & Videos
    useEffect(() => {
        if (activeTab === "news") {
            if (news.length === 0) {
                setLoadingNews(true);
                fetchFarmingNews(language, 1).then(data => {
                    setNews(data);
                    setNewsPage(1);
                }).finally(() => setLoadingNews(false));
            }
        }
        if (activeTab === "videos" && videos.length === 0) {
            setLoadingVideos(true);
            fetchFarmingVideos(language).then(({ videos, nextPageToken }) => {
                setVideos(videos);
                setVideoNextToken(nextPageToken);
            }).finally(() => setLoadingVideos(false));
        }
    }, [activeTab, language]);

    // Reset news on language change
    useEffect(() => {
        if (activeTab === "news") {
            setNews([]);
            setLoadingNews(true);
            fetchFarmingNews(language, 1).then(data => {
                setNews(data);
                setNewsPage(1);
            }).finally(() => setLoadingNews(false));
        }
    }, [language]);

    // Handlers
    const handleProfileChange = (field: keyof FarmerProfile, value: any) => {
        setProfile(prev => ({ ...prev, [field]: value }));
        toast.success(t('advisoryHub.eligibility.profileUpdated') || "Profile updated! Checking eligibility...");
    };

    const handleLoadMoreNews = async () => {
        const nextPage = newsPage + 1;
        setLoadingNews(true);
        const newArticles = await fetchFarmingNews(language, nextPage);
        setNews(prev => [...prev, ...newArticles]);
        setNewsPage(nextPage);
        setLoadingNews(false);
    };

    const handleLoadMoreVideos = async () => {
        if (!videoNextToken) return;
        setLoadingVideos(true);
        const { videos: newVideos, nextPageToken } = await fetchFarmingVideos(language, videoNextToken);
        setVideos(prev => [...prev, ...newVideos]);
        setVideoNextToken(nextPageToken);
        setLoadingVideos(false);
    };

    const handleRefresh = () => {
        if (activeTab === "videos") {
            setVideos([]);
            setVideoNextToken(undefined);
            setLoadingVideos(true);
            // If search query exists, refresh that search, else random
            const query = searchQuery || undefined;
            // Clear search query if refreshing to get random? No, keep context if typed.
            // Actually, if user hits refresh button, maybe they want random new content?
            // Let's keep search query if present.
            fetchFarmingVideos(language, undefined, query).then(({ videos, nextPageToken }) => {
                setVideos(videos);
                setVideoNextToken(nextPageToken);
            }).finally(() => setLoadingVideos(false));
            toast.success(t('advisoryHub.toasts.videosRefreshed'));
        } else if (activeTab === "news") {
            setNews([]);
            setNewsPage(1);
            setLoadingNews(true);
            fetchFarmingNews(language, 1).then(data => {
                setNews(data);
                setNewsPage(1);
            }).finally(() => setLoadingNews(false));
            toast.success(t('advisoryHub.toasts.newsRefreshed'));
        } else if (activeTab === "schemes") {
            // For schemes, maybe trigger AI re-check or just re-run eligible
            const eligible = getEligibleSchemes(profile, ALL_SCHEMES);
            setSchemes([...eligible, ...aiSchemes]);
            toast.success(t('advisoryHub.toasts.schemesRefreshed'));
        }
    };

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        setActiveTab("videos");
        setVideos([]);
        setVideoNextToken(undefined);
        setLoadingVideos(true);
        fetchFarmingVideos(language, undefined, searchQuery).then(({ videos, nextPageToken }) => {
            setVideos(videos);
            setVideoNextToken(nextPageToken);
        }).finally(() => setLoadingVideos(false));
    };

    const handleVoiceSearch = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = language === 'Hindi' ? 'hi-IN' : 'en-IN';
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                setIsListening(true);
                toast.info(t('common.listening') || "Listening...");
            };

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setSearchQuery(transcript);
                handleSearch(); // Auto-search on voice result
            };

            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
                toast.error(t('common.voiceError') || "Voice input failed. Please try again.");
            };

            recognition.onend = () => {
                setIsListening(false);
                // Trigger search explicitly if needed, but onresult handles it
                if (searchQuery) handleSearch();
            };

            recognition.start();
            toast.error(t('common.voiceUnsupported'));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6 max-w-7xl animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-green-800 flex items-center gap-2">
                        <Sprout className="h-8 w-8" /> {t('advisoryHub.title')}
                    </h1>
                    <p className="text-gray-600 mt-1">{t('advisoryHub.subtitle')}</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                    <TabsList className="bg-slate-900 border border-slate-800 p-1 mb-6">
                        <TabsTrigger value="schemes" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">{t('advisoryHub.tabs.schemes')}</TabsTrigger>
                        <TabsTrigger value="calculator" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">{t('advisoryHub.tabs.calculator')} <span className="ml-2 text-[10px] bg-green-900 text-green-400 px-1 rounded">{t('common.offline')}</span></TabsTrigger>
                        <TabsTrigger value="news" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">{t('advisoryHub.tabs.news')}</TabsTrigger>
                        <TabsTrigger value="videos" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">{t('advisoryHub.tabs.videos')}</TabsTrigger>
                        <TabsTrigger value="suppliers" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">{t('advisoryHub.tabs.suppliers', 'Nearby Suppliers')} 🔥</TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2">
                        {activeTab === "videos" && (
                            <div className="flex items-center gap-2 bg-green-100 border border-black rounded-full px-4 py-1.5 shadow-sm hover:shadow-md transition-all">
                                <Input
                                    placeholder={t('advisoryHub.searchPlaceholder', { defaultValue: 'Search farming news & videos...' })}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="border-none shadow-none focus-visible:ring-0 h-8 w-[200px] md:w-[350px] bg-transparent text-green-900 placeholder:text-green-700/60"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-8 w-8 ${isListening ? 'text-red-600 animate-pulse' : 'text-green-700 hover:text-black hover:bg-green-300/50 transition-colors'}`}
                                    onClick={handleVoiceSearch}
                                >
                                    <Mic className="h-5 w-5" />
                                </Button>
                                <div className="h-5 w-[1.5px] bg-green-400 mx-1"></div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-green-700 hover:text-black hover:bg-green-300/50 transition-colors"
                                    onClick={handleSearch}
                                >
                                    <Search className="h-5 w-5" />
                                </Button>
                            </div>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRefresh}
                            className="text-gray-500 hover:text-green-700 hover:bg-green-50"
                            title={t('advisoryHub.buttons.refresh')}
                        >
                            <RefreshCw className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* --- SCHEMES TAB --- */}
                <TabsContent value="schemes" className="space-y-6">
                    {/* Eligibility Card */}
                    <Card className="border-gray-800 bg-black shadow-md">
                        <CardHeader>
                            <CardTitle className="text-white">{t('advisoryHub.eligibility.title')}</CardTitle>
                            <CardDescription className="text-gray-400">{t('advisoryHub.eligibility.desc')}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label className="text-gray-200">{t('advisoryHub.eligibility.state')}</Label>
                                <Select value={profile.state} onValueChange={(v) => handleProfileChange("state", v)}>
                                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Bihar">Bihar</SelectItem>
                                        <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                                        <SelectItem value="Punjab">Punjab</SelectItem>
                                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-200">{t('advisoryHub.eligibility.landSize')}</Label>
                                <Input
                                    type="number"
                                    value={profile.landSize}
                                    onChange={(e) => handleProfileChange("landSize", parseFloat(e.target.value) || 0)}
                                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-200">{t('advisoryHub.eligibility.farmerType')}</Label>
                                <Select value={profile.farmerType} onValueChange={(v) => handleProfileChange("farmerType", v)}>
                                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Small">{t('common.farmerTypes.small')}</SelectItem>
                                        <SelectItem value="Marginal">{t('common.farmerTypes.marginal')}</SelectItem>
                                        <SelectItem value="Large">{t('common.farmerTypes.large')}</SelectItem>
                                        <SelectItem value="Landless">{t('common.farmerTypes.landless')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Loading & Content Section */}
                    {loadingAiSchemes && (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-md border border-blue-200 animate-pulse">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-sm font-medium">{t('advisoryHub.loading.aiScanning')}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {schemes.slice(0, visibleCount).map((scheme, index) => (
                            <SchemeCard key={`${scheme.id}-${index}`} scheme={scheme} language={language} />
                        ))}
                        {schemes.length === 0 && !loadingAiSchemes && (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                <p>{t('advisoryHub.noData.noSchemes', { state: profile.state })}</p>
                                <Button variant="link" onClick={() => setProfile(prev => ({ ...prev, state: "All" }))}>
                                    {t('advisoryHub.noData.allIndiaBtn')}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Load More Button */}
                    <div className="flex justify-center mt-6 pb-8">
                        <Button
                            variant="outline"
                            onClick={handleLoadMoreSchemes}
                            disabled={loadingAiSchemes}
                            className="min-w-[200px]"
                        >
                             {loadingAiSchemes ? (
                                 <>
                                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                     {t('advisoryHub.loading.findingSchemes')}
                                 </>
                             ) : (
                                 <>
                                     {visibleCount < schemes.length ? t('advisoryHub.buttons.loadMore') : t('advisoryHub.buttons.findAi')}
                                 </>
                             )}
                        </Button>
                    </div>
                </TabsContent>

                {/* --- NEWS TAB --- */}
                <TabsContent value="news" className="space-y-6">
                    {!import.meta.env.VITE_NEWS_API_KEY && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                            <p className="font-bold">{t('advisoryHub.configNeeded.title')}</p>
                            <p>{t('advisoryHub.configNeeded.desc', { key: 'VITE_NEWS_API_KEY', feature: t('advisoryHub.tabs.news') })}</p>
                        </div>
                    )}
                    {/* News Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {news.map((item, idx) => (
                            <NewsCard key={idx} article={item} language={language} />
                        ))}
                    </div>

                    {loadingNews && (
                        <div className="flex justify-center py-4"><Loader2 className="h-8 w-8 animate-spin text-green-600" /></div>
                    )}

                    {/* Load More Text */}
                    {news.length > 0 && !loadingNews && (
                        <div
                            onClick={handleLoadMoreNews}
                            className="text-center py-4 text-gray-400 text-xs tracking-widest uppercase cursor-pointer hover:text-green-600 transition-colors select-none"
                        >
                            {t('advisoryHub.buttons.loadMore')}
                        </div>
                    )}
                    {news.length === 0 && !loadingNews && (
                        <div className="text-center py-20 text-gray-500">{t('advisoryHub.noData.noNews')}</div>
                    )}
                </TabsContent>

                {/* --- VIDEOS TAB --- */}
                <TabsContent value="videos" className="space-y-6">
                    {!import.meta.env.VITE_YOUTUBE_API_KEY && (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                            <p className="font-bold">{t('advisoryHub.configNeeded.title')}</p>
                            <p>{t('advisoryHub.configNeeded.desc', { key: 'VITE_YOUTUBE_API_KEY', feature: t('advisoryHub.tabs.videos') })}</p>
                        </div>
                    )}

                    {/* Videos Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {videos.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>

                    {loadingVideos && (
                        <div className="flex justify-center py-4"><Loader2 className="h-8 w-8 animate-spin text-red-600" /></div>
                    )}

                    {videos.length > 0 && !loadingVideos && (
                        <div
                            onClick={handleLoadMoreVideos}
                            className="text-center py-4 text-gray-400 text-xs tracking-widest uppercase cursor-pointer hover:text-red-500 transition-colors select-none"
                        >
                            {t('advisoryHub.buttons.loadMore')}
                        </div>
                    )}
                    {videos.length === 0 && !loadingVideos && (
                        <div className="text-center py-20 text-gray-500">{t('advisoryHub.noData.noVideos')}</div>
                    )}
                </TabsContent>

                <TabsContent value="calculator" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="max-w-2xl mx-auto py-8">
                        <Suspense fallback={<div className="h-64 flex items-center justify-center text-slate-500">{t('advisoryHub.loading.loadingCalc')}</div>}>
                            <OfflineFertilizerCalculator />
                        </Suspense>
                    </div>
                </TabsContent>

                <TabsContent value="suppliers" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* List View */}
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                             {loadingSuppliers ? (
                                Array(6).fill(0).map((_, i) => (
                                    <Card key={i} className="animate-pulse bg-slate-900 border-slate-800">
                                        <div className="h-40 bg-slate-800 rounded-t-xl"></div>
                                        <div className="p-4 space-y-3">
                                            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                                        </div>
                                    </Card>
                                ))
                            ) : nearbySuppliers.length > 0 ? (
                                nearbySuppliers.map((supplier) => (
                                    <Card key={supplier.id} className="bg-slate-900 border-slate-800 hover:border-orange-500/50 transition-all group overflow-hidden">
                                         <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${supplier.type === 'Government' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                                                    {supplier.type}
                                                </span>
                                                <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                                                    <Star className="h-3 w-3 fill-current" /> {supplier.rating}
                                                </div>
                                            </div>
                                            <CardTitle className="text-white text-lg group-hover:text-orange-400 transition-colors uppercase">{supplier.name}</CardTitle>
                                            <CardDescription className="text-slate-400 text-xs flex items-start gap-1 mt-1">
                                                <MapPin className="h-3 w-3 mt-0.5 shrink-0" /> {supplier.address}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4 pb-4">
                                            <div className="flex items-center gap-2 text-[10px] text-slate-300 bg-slate-800/50 p-2 rounded">
                                                <Sprout className="h-3 w-3 text-green-500" />
                                                <span>{supplier.availableSeeds.join(", ")}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" className="flex-1 h-8 text-[10px] border-slate-700 hover:bg-slate-800 text-slate-300" onClick={() => window.open(`tel:${supplier.phone}`)}>
                                                    <Phone className="h-3 w-3 mr-1" /> Call
                                                </Button>
                                                <Button className="flex-1 h-8 text-[10px] bg-orange-600 hover:bg-orange-700 text-white" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(supplier.name + ' ' + supplier.address)}`, '_blank')}>
                                                    <ExternalLink className="h-3 w-3 mr-1" /> Directions
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-20 text-slate-500 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                                    <MapPin className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                    <p className="text-sm font-medium text-slate-400 mb-2">No suppliers found in this area.</p>
                                    <Button size="sm" variant="outline" className="border-slate-700 text-slate-300" onClick={handleGetLocation}>
                                        Retry Search
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Interactive Leaflet Map */}
                        <div className="h-[600px] sticky top-24">
                             <NearbySuppliersMap 
                                suppliers={nearbySuppliers}
                                userLocation={getProfileLocation(user?.email) || undefined}
                             />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdvisoryHub;
