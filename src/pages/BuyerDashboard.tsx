import { API_BASE_URL } from '@/config/api';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
    Search, Filter, MapPin, TrendingUp, Phone,
    MessageSquare, Star, Truck, Calendar, ShoppingBag,
    Leaf, ArrowUpRight, ArrowDownRight, Globe, Clock, CheckCircle2, 
    AlertTriangle, ArrowRight, Loader2, Database, ShieldCheck, Volume2
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { 
    getListings, 
    createNegotiation, 
    getNegotiations, 
    createInteraction, 
    getInteractions, 
    createDemand,
    getListingsStream
} from '@/services/firebaseService';
import axios from 'axios';
import { BuyerVoiceAssistant } from '@/components/BuyerVoiceAssistant';
import { translateAnalysisResults } from '@/lib/ai-translation';

interface Listing {
    id: string;
    farmerName: string;
    cropName: string;
    quantity: number;
    price: number;
    location: string;
    harvestDate?: string;
    quality?: string;
    timestamp: string;
    contactNumber?: string;
}

interface MarketInsight {
    analysis_brief: string;
    demand_indicator: string;
    price_forecast: string;
    msp_comparison: string;
    current_price?: string | number;
    voice_script?: string;
    insights: { type: string, text: string, icon?: string }[];
}

interface BlockchainRecord {
    action: string;
    location: string;
    timestamp: number;
    actor: string;
}

interface Interaction {
    id?: string;
    crop: string;
    farmerName: string;
    farmerId?: string;
    buyerName: string;
    timestamp: unknown;
}

interface Negotiation {
    id?: string;
    crop: string;
    sellerName: string;
    sellerId?: string;
    buyerName: string;
    originalPrice: number;
    offerPrice: number;
    status: 'Pending' | 'Accepted' | 'Rejected';
    createdAt?: unknown;
}

const BuyerDashboard = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuthStore();
    const { toast } = useToast();
    const API_URL = API_BASE_URL; 

    const [activeTab, setActiveTab] = useState("marketplace");
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCrop, setSelectedCrop] = useState("All");
    const [selectedState, setSelectedState] = useState("All");

    // Intelligence / Price Check
    const [insight, setInsight] = useState<MarketInsight | null>(null);
    const [insightLoading, setInsightLoading] = useState(false);
    const [targetCrop, setTargetCrop] = useState("Wheat");
    const [targetState, setTargetState] = useState("Punjab");
    const [targetDistrict, setTargetDistrict] = useState("");

    // Traceability State
    const [searchBatchId, setSearchBatchId] = useState('');
    const [isSearchingTrace, setIsSearchingTrace] = useState(false);
    const [cropHistory, setCropHistory] = useState<BlockchainRecord[] | null>(null);

    // Interactions & Negotiations
    const [interactions, setInteractions] = useState<Interaction[]>([]);
    const [negotiations, setNegotiations] = useState<Negotiation[]>([]);

    // Negotiations Modal State
    const [isNegOpen, setIsNegOpen] = useState(false);
    const [negTarget, setNegTarget] = useState<Listing | null>(null);
    const [offerPrice, setOfferPrice] = useState("");
    const [offerMsg, setOfferMsg] = useState("");
    const [negSubmitting, setNegSubmitting] = useState(false);

    const [contactModalOpen, setContactModalOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
    const [savedListings, setSavedListings] = useState<Set<string>>(new Set());


    useEffect(() => {
        // Seed sample data for traceability demo
        const samples = [
            {
                id: 'BATCH-7633',
                crop: 'Sharbati Wheat (Premium Grade)',
                origin: 'Hoshangabad, Madhya Pradesh',
                quality: 'A+ Grade (Organic)',
                timestamp: new Date().toISOString(),
                events: [
                    { action: 'harvested', timestamp: '2025-05-10T10:00:00Z', actor: 'Farmer Ramesh', location: 'Farm #402' },
                    { action: 'packaged', timestamp: '2025-05-12T15:30:00Z', actor: 'AgriLogistics Hub', location: 'Bhopal' },
                    { action: 'in-transit', timestamp: '2025-05-14T09:15:00Z', actor: 'Transport Corp', location: 'En-route' }
                ]
            }
        ];
        samples.forEach(s => {
            if (!localStorage.getItem(`batch_${s.id}`)) {
                localStorage.setItem(`batch_${s.id}`, JSON.stringify(s));
            }
        });
    }, []);

    const fetchNegotiations = React.useCallback(async () => {
        if (!user) return;
        try {
            const data = await getNegotiations({ buyerName: user.name });
            setNegotiations(data as unknown as Negotiation[]);
        } catch (err) {
            console.error("Failed to fetch negotiations", err);
        }
    }, [user]);

    const handleSpeak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = i18n.language === 'en' ? 'en-IN' : i18n.language;
            window.speechSynthesis.speak(utterance);
        }
    };

    const fetchListings = () => {
        setLoading(true);
        return getListingsStream((data) => {
            setListings(data as Listing[]);
            setLoading(false);
        });
    };

    const fetchInsights = async () => {
        try {
            setInsightLoading(true);
            const res = await axios.post(`${API_URL}/buyer/insights`, {
                crop: targetCrop,
                state: targetState,
                district: targetDistrict
            });
            const rawInsight = res.data;
            
            const langMap: Record<string, string> = {
                'en': 'English', 'hi': 'Hindi', 'bn': 'Bengali', 'as': 'Assamese', 'kn': 'Kannada'
            };
            const targetLang = langMap[i18n.language] || 'English';
            
            const translatedInsight = await translateAnalysisResults(rawInsight, targetLang);
            setInsight(translatedInsight as unknown as MarketInsight);
        } catch (error) {
            toast({ title: t('common.error'), description: t('buyer.errorInsights'), variant: "destructive" });
        } finally {
            setInsightLoading(false);
        }
    };

    const fetchInteractions = React.useCallback(async () => {
        if (!user) return;
        try {
            const data = await getInteractions(user.id);
            setInteractions(data as unknown as Interaction[]);
        } catch (error) {
            console.error(error);
        }
    }, [user]);

    useEffect(() => {
        const unsub = fetchListings();
        if (user) {
            fetchInteractions();
            fetchNegotiations();
        }
        return () => {
            if (unsub) unsub();
        };
    }, [user, i18n.language, fetchInteractions, fetchNegotiations]);

    const handleContact = async (listing: Listing) => {
        if (!user) {
            toast({ title: t('buyer.loginRequired'), description: t('buyer.loginRequiredDesc') });
            return;
        }

        setSelectedListing(listing);
        setContactModalOpen(true);

        try {
            await createInteraction({
                buyerId: user.id,
                listingId: listing.id,
                farmerName: listing.farmerName,
                crop: listing.cropName
            });
            fetchInteractions();
        } catch (error) {
            console.error(error);
        }
    };

    const handleMakeOffer = async () => {
        if (!offerPrice || !negTarget || !user) return;
        setNegSubmitting(true);
        try {
            await createNegotiation({
                listingId: negTarget.id,
                buyerId: user.id,
                buyerName: user.name,
                sellerName: negTarget.farmerName,
                offerPrice: parseFloat(offerPrice),
                originalPrice: negTarget.price,
                crop: negTarget.cropName,
                message: offerMsg,
            });
            toast({ title: t('common.success'), description: t('buyer.offerSent') });
            setIsNegOpen(false);
            setOfferPrice("");
            setOfferMsg("");
            fetchNegotiations();
        } catch (err) {
            toast({ title: t('common.error'), description: "Failed to send offer.", variant: "destructive" });
        } finally {
            setNegSubmitting(false);
        }
    };

    const handleTrace = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearchingTrace(true);
        setTimeout(() => {
            setIsSearchingTrace(false);
            if (searchBatchId.trim() !== '') {
                let normalized = searchBatchId.toUpperCase();
                if (!normalized.startsWith('BATCH-')) normalized = `BATCH-${normalized}`;
                const stored = localStorage.getItem(`batch_${normalized}`);
                if (stored) {
                    const record = JSON.parse(stored);
                    setCropHistory(record.events || []);
                } else {
                    setCropHistory(null);
                    toast({ title: t('trace.recordNotFound'), variant: "destructive" });
                }
            }
        }, 1000);
    };

    const toggleSave = (id: string) => {
        const newSaved = new Set(savedListings);
        if (newSaved.has(id)) {
            newSaved.delete(id);
            toast({ description: t('buyer.toast.unsaved') });
        } else {
            newSaved.add(id);
            toast({ description: t('buyer.toast.saved') });
        }
        setSavedListings(newSaved);
    };

    const [postDemandOpen, setPostDemandOpen] = useState(false);
    const [demandData, setDemandData] = useState({
        crop: "",
        quantity: "",
        price: "",
        location: ""
    });

    const handlePanIndia = () => {
        setSelectedState("All");
        setSelectedCrop("All");
        setSearchQuery("");
        toast({ description: t('buyer.panIndia') });
    };

    const handlePostDemand = async () => {
        if (!demandData.crop || !demandData.quantity) {
            toast({ variant: "destructive", description: t('buyer.fillFields') });
            return;
        }

        try {
            await createDemand({
                ...demandData,
                buyerName: user?.name || "Verified Buyer",
                buyerId: user?.id
            });
            toast({ title: t('common.success'), description: t('buyer.demand.posted') });
            setPostDemandOpen(false);
            setDemandData({ crop: "", quantity: "", price: "", location: "" });
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", description: t('buyer.errorPostDemand') });
        }
    };

    const filteredListings = listings.filter(l => {
        const matchesSearch = l.cropName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.location?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCrop = selectedCrop === "All" || l.cropName?.toLowerCase() === selectedCrop.toLowerCase();
        const matchesState = selectedState === "All" || l.location?.toLowerCase().includes(selectedState.toLowerCase());
        return matchesSearch && matchesCrop && matchesState;
    });

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-20 relative">
            <Navbar />

            {/* Custom Contact Modal */}
            {contactModalOpen && selectedListing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <Card className="w-full max-w-md bg-slate-900 border-slate-700 shadow-2xl scale-100 animate-in zoom-in-95">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Phone className="w-5 h-5 text-green-400" />
                                {t('buyer.contact.title')}
                            </CardTitle>
                            <CardDescription>{t('buyer.contact.desc', { name: selectedListing.farmerName })}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
                                <span className="text-slate-400">{t('buyer.contact.phone')}</span>
                                <span className="text-xl font-mono text-white select-all">
                                    {selectedListing.contactNumber || "+91 98765-43210"}
                                </span>
                            </div>
                            <div className="text-xs text-slate-500">
                                * {t('buyer.recordedNote')}
                            </div>
                            <div className="flex gap-2">
                                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                                    <MessageSquare className="w-4 h-4 mr-2" /> {t('buyer.contact.whatsapp')}
                                </Button>
                                <Button className="flex-1" variant="secondary" onClick={() => window.open(`tel:${selectedListing.contactNumber || "+919876543210"}`)}>
                                    <Phone className="w-4 h-4 mr-2" /> {t('buyer.contact.call')}
                                </Button>
                            </div>
                            <Button variant="outline" className="w-full border-slate-700" onClick={() => setContactModalOpen(false)}>
                                {t('buyer.contact.close')}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Negotiation Modal */}
            <Dialog open={isNegOpen} onOpenChange={setIsNegOpen}>
                <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-orange-500" />
                            Negotiate for {negTarget?.cropName}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Propose a fair price to {negTarget?.farmerName}. Use AI benchmrks for better deals.
                        </DialogDescription>
                    </DialogHeader>
                    {negTarget && (
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                                    <Label className="text-xs text-slate-500">Farmers Price</Label>
                                    <p className="text-lg font-bold text-white">₹{negTarget.price}/Q</p>
                                </div>
                                <div className="p-3 bg-green-900/20 rounded border border-green-800/30">
                                    <Label className="text-xs text-green-500/70 text-secondary-foreground">AI Mandi Benchmark</Label>
                                    <p className="text-lg font-bold text-green-400">₹{Math.round(negTarget.price * 0.9)}/Q</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Your Offer Price (₹ per Quintal)</Label>
                                <Input 
                                    type="number" 
                                    value={offerPrice} 
                                    onChange={(e) => setOfferPrice(e.target.value)}
                                    placeholder="Enter your best offer"
                                    className="bg-black/40 border-slate-700 h-12 text-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Message to Farmer</Label>
                                <textarea 
                                    className="w-full bg-black/40 border border-slate-700 rounded-md p-3 text-sm focus:ring-1 focus:ring-orange-500 outline-none"
                                    rows={3}
                                    value={offerMsg}
                                    onChange={(e) => setOfferMsg(e.target.value)}
                                    placeholder="e.g., I'm interested in bulk purchase. Can we do ₹1950?"
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsNegOpen(false)} className="border-slate-800">Cancel</Button>
                        <Button className="bg-orange-600 hover:bg-orange-700 h-10 px-8" onClick={handleMakeOffer} disabled={negSubmitting}>
                            {negSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Send Offer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Post Demand Modal */}
            <Dialog open={postDemandOpen} onOpenChange={setPostDemandOpen}>
                <DialogContent className="bg-slate-900 border-slate-700 text-white">
                    <DialogHeader>
                        <DialogTitle>{t('buyer.postDemand')}</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Create a buyer demand to notify local farmers of your procurement needs.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>{t('buyer.filters.search')} (Crop)</Label>
                            <Input 
                                value={demandData.crop}
                                onChange={(e) => setDemandData({...demandData, crop: e.target.value})}
                                placeholder="e.g. Wheat"
                                className="bg-black/40 border-slate-700"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Quantity (Qtl)</Label>
                                <Input 
                                    type="number"
                                    value={demandData.quantity}
                                    onChange={(e) => setDemandData({...demandData, quantity: e.target.value})}
                                    placeholder="e.g. 50"
                                    className="bg-black/40 border-slate-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Target Price (₹/Q)</Label>
                                <Input 
                                    type="number"
                                    value={demandData.price}
                                    onChange={(e) => setDemandData({...demandData, price: e.target.value})}
                                    placeholder="e.g. 2100"
                                    className="bg-black/40 border-slate-700"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input 
                                value={demandData.location}
                                onChange={(e) => setDemandData({...demandData, location: e.target.value})}
                                placeholder="e.g. Amritsar, Punjab"
                                className="bg-black/40 border-slate-700"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPostDemandOpen(false)} className="border-slate-800">Cancel</Button>
                        <Button className="bg-orange-600 hover:bg-orange-700" onClick={handlePostDemand}>
                            Post Demand
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <main className="container mx-auto px-4 py-8 pt-24">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-orange-400 border-orange-400/30 bg-orange-400/10">
                                {t('buyer.title')}
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-600">
                            {t('buyer.welcome', { name: user?.name || t('buyer.trader') })}
                        </h1>
                        <p className="text-slate-400 mt-1">{t('buyer.subtitle')}</p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="border-slate-800 text-slate-300 gap-2 hover:bg-slate-800"
                            onClick={handlePanIndia}
                        >
                            <Globe className="w-4 h-4" /> {t('buyer.panIndia')}
                        </Button>
                        <Button
                            className="bg-orange-600 hover:bg-orange-700 gap-2"
                            onClick={() => setPostDemandOpen(true)}
                        >
                            <ShoppingBag className="w-4 h-4" /> {t('buyer.postDemand')}
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-slate-900 border border-slate-800 p-1 flex-wrap h-auto">
                        <TabsTrigger value="marketplace" className="px-6">{t('buyer.tabs.listings')}</TabsTrigger>
                        <TabsTrigger value="negotiations" className="px-6 font-semibold bg-gradient-to-r from-orange-400 to-amber-600 bg-clip-text text-transparent hover:text-orange-400 transition-all">{t('buyer.tabs.negotiations')}</TabsTrigger>
                        <TabsTrigger value="traceability" className="px-6">{t('trace.title')}</TabsTrigger>
                        <TabsTrigger value="intelligence" className="px-6">{t('buyer.tabs.intelligence')}</TabsTrigger>
                        <TabsTrigger value="deals" className="px-6">{t('buyer.tabs.deals')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="marketplace" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                            <div className="md:col-span-2 relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder={t('buyer.filters.search')}
                                    className="pl-10 bg-black/40 border-slate-700 text-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                                <SelectTrigger className="bg-black/40 border-slate-700"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">{t('buyer.filters.allCrops')}</SelectItem>
                                    <SelectItem value="Wheat">Wheat</SelectItem>
                                    <SelectItem value="Rice">Rice</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={selectedState} onValueChange={setSelectedState}>
                                <SelectTrigger className="bg-black/40 border-slate-700"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">{t('buyer.filters.allStates')}</SelectItem>
                                    <SelectItem value="Punjab">Punjab</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {loading ? (
                                <div className="col-span-full py-12 text-center text-slate-500 animate-pulse">{t('buyer.loading')}</div>
                            ) : filteredListings.length === 0 ? (
                                <div className="col-span-full py-20 text-center border border-dashed border-slate-800 rounded-xl">
                                    <Leaf className="w-12 h-12 mx-auto text-slate-700 mb-4" />
                                    <p className="text-slate-500">{t('buyer.noListings')}</p>
                                </div>
                            ) : (
                                filteredListings.map(listing => (
                                    <Card key={listing.id} className="bg-slate-900 border-slate-800 hover:border-orange-500/50 transition-all group overflow-hidden relative">
                                        <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-xl text-white">{listing.cropName}</CardTitle>
                                                    <CardDescription className="flex items-center gap-1 mt-1 text-slate-400">
                                                        <MapPin className="w-3 h-3" /> {listing.location}
                                                    </CardDescription>
                                                </div>
                                                <Badge variant="secondary" className="bg-green-900/30 text-green-400 border-green-800">
                                                    {listing.quality || t('buyer.gradeA')}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                                                        <span className="block text-slate-500 text-xs">{t('buyer.card.quantity')}</span>
                                                        <span className="text-lg font-semibold text-white">{listing.quantity} Qtl</span>
                                                    </div>
                                                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                                                        <span className="block text-slate-500 text-xs">{t('buyer.card.price')}</span>
                                                        <span className="text-lg font-semibold text-green-400">₹{listing.price}</span>
                                                    </div>
                                                </div>

                                                <div className="pt-2 border-t border-slate-800 flex flex-col gap-3">
                                                    <div className="flex items-center justify-between p-2 bg-yellow-400/10 rounded border border-yellow-400/20">
                                                        <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-semibold">
                                                            <TrendingUp className="w-3.5 h-3.5" /> Mandi: ₹{Math.round(listing.price * 1.15)}
                                                        </div>
                                                        <Badge className="bg-green-600 hover:bg-green-600 text-[10px]">Save ₹{Math.round(listing.price * 0.15)}/Q here</Badge>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button className="flex-1 bg-white text-black hover:bg-slate-200 h-10" onClick={() => handleContact(listing)}>
                                                            <Phone className="w-4 h-4 mr-2" /> {t('buyer.card.callFarmer')}
                                                        </Button>
                                                        <Button 
                                                            className="flex-1 bg-slate-800 text-orange-500 hover:bg-slate-700 border border-orange-500/30 h-10"
                                                            onClick={() => {
                                                                setNegTarget(listing);
                                                                setIsNegOpen(true);
                                                                setOfferPrice(listing.price.toString());
                                                            }}
                                                        >
                                                            <ArrowRight className="w-4 h-4 mr-2" /> {t('Negotiate')}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="negotiations" className="space-y-6">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-orange-400" />
                                    Active Negotiations
                                </CardTitle>
                                <CardDescription>Track your price offers and farmer responses.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {negotiations.length === 0 ? (
                                        <div className="text-center py-12 border border-dashed border-slate-800 rounded-lg">
                                            <TrendingUp className="w-12 h-12 mx-auto text-slate-700 mb-4" />
                                            <p className="text-slate-500">No active negotiations found.</p>
                                        </div>
                                    ) : (
                                        negotiations.map((neg, i) => (
                                            <div key={i} className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                                                        <Leaf className="w-6 h-6 text-orange-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-bold text-white">{neg.crop}</h4>
                                                        <p className="text-sm text-slate-400">Sold by: {neg.sellerName}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 items-center flex-1 lg:max-w-2xl">
                                                    <div>
                                                        <span className="block text-[10px] uppercase text-slate-500 tracking-wider">Original Price</span>
                                                        <span className="text-lg font-medium text-slate-300">₹{neg.originalPrice}/Q</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] uppercase text-orange-500 tracking-wider">Your Offer</span>
                                                        <span className="text-lg font-bold text-orange-400">₹{neg.offerPrice}/Q</span>
                                                    </div>
                                                    <div>
                                                        <Badge className={
                                                            neg.status === 'Accepted' ? 'bg-green-600' :
                                                            neg.status === 'Rejected' ? 'bg-red-600' : 'bg-blue-600'
                                                        }>
                                                            {neg.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="sm" className="border-slate-800">Details</Button>
                                                    {neg.status === 'Accepted' && <Button size="sm" className="bg-green-600">Complete Payment</Button>}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="traceability" className="space-y-6">
                        <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-blue-900/20 to-transparent border-b border-slate-800 pb-8">
                                <CardTitle className="text-2xl text-white flex items-center gap-3">
                                    <Database className="w-8 h-8 text-blue-400" />
                                    Blockchain Traceability Hub
                                </CardTitle>
                                <CardDescription className="text-slate-400 max-w-2xl">
                                    Verify the authenticity and journey of your produce using our decentralized ledger. 
                                    Every step from harvest to your warehouse is recorded immutably.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-8">
                                <form onSubmit={handleTrace} className="flex gap-4 max-w-2xl mb-12">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                                        <Input 
                                            placeholder="Enter Batch ID (e.g. BATCH-8314)" 
                                            className="pl-10 bg-black/40 border-slate-700 h-11"
                                            value={searchBatchId}
                                            onChange={(e) => setSearchBatchId(e.target.value)}
                                        />
                                    </div>
                                    <Button className="bg-blue-600 hover:bg-blue-700 h-11 px-8">
                                        Trace Journey
                                    </Button>
                                </form>

                                {cropHistory ? (
                                    <div className="relative border-l-2 border-slate-800 ml-4 py-4 space-y-8">
                                        {cropHistory.map((h, i) => (
                                            <div key={i} className="relative pl-10 group">
                                                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-blue-500 group-hover:scale-125 transition-all" />
                                                <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700 group-hover:border-blue-500/50 transition-all">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-bold text-white capitalize">{h.action}</h4>
                                                        <span className="text-xs text-slate-500">{new Date(h.timestamp).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {h.location}</span>
                                                        <span className="font-mono text-xs text-blue-400/70 truncate max-w-[200px]">Node: {h.actor}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-slate-950/30 rounded-2xl border border-dotted border-slate-800">
                                        <ShieldCheck className="w-16 h-16 mx-auto text-slate-800 mb-4" />
                                        <p className="text-slate-500">Enter a batch ID to pull records from the blockchain ledger.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="intelligence" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="bg-slate-900 border-slate-800 h-fit">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-blue-400" /> {t('buyer.intelligence.scope')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm text-slate-400">{t('buyer.targetCrop')}</label>
                                        <Select value={targetCrop} onValueChange={setTargetCrop}>
                                            <SelectTrigger className="bg-black/20 border-slate-700"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {["Wheat", "Rice", "Maize", "Cotton", "Tomato", "Potato"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-slate-400">{t('gov.labels.state')}</label>
                                        <Select value={targetState} onValueChange={setTargetState}>
                                            <SelectTrigger className="bg-black/20 border-slate-700"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {["Punjab", "Haryana", "Uttar Pradesh", "Bihar", "Rajasthan"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-slate-400">{t('gov.labels.district')}</label>
                                        <Input 
                                            placeholder="e.g. Ludhiana" 
                                            value={targetDistrict} 
                                            onChange={(e) => setTargetDistrict(e.target.value)} 
                                            className="bg-black/20 border-slate-700"
                                        />
                                    </div>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={fetchInsights} disabled={insightLoading}>
                                        {insightLoading ? t('buyer.intelligence.analyzing') : t('buyer.intelligence.genBtn')}
                                    </Button>
                                </CardContent>
                            </Card>

                            <div className="lg:col-span-2">
                                {insight && (
                                    <div className="space-y-6">
                                        <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                                            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                                            <CardHeader className="pb-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-1">
                                                        <CardTitle className="text-white text-xl flex items-center gap-2">
                                                            <TrendingUp className="h-5 w-5 text-blue-400" />
                                                            {t('buyer.intelligence.strategicAnalysis')}
                                                        </CardTitle>
                                                        <CardDescription className="text-slate-400 text-sm">
                                                            Custom Intelligence for {targetCrop} in {targetDistrict || targetState}
                                                        </CardDescription>
                                                    </div>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="flex items-center gap-2 border-blue-500/30 bg-blue-500/5 text-blue-400 hover:bg-blue-500/10"
                                                        onClick={() => handleSpeak(insight.voice_script || `${insight.analysis_brief}. ${insight.insights.map(i => i.text).join('. ')}`)}
                                                    >
                                                        <Volume2 className="h-4 w-4" /> {t('buyer.intelligence.listen')}
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                                    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                                                        <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Market Price</span>
                                                        <span className="text-lg font-bold text-white">₹{insight.current_price}/kg</span>
                                                    </div>
                                                    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                                                        <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Demand</span>
                                                        <Badge variant="outline" className={`
                                                            ${insight.demand_indicator === 'High' ? 'border-orange-500/50 text-orange-400 bg-orange-400/5' : 
                                                              insight.demand_indicator === 'Medium' ? 'border-blue-500/50 text-blue-400 bg-blue-400/5' : 
                                                              'border-slate-500/50 text-slate-400 bg-slate-400/5'}
                                                        `}>
                                                            {insight.demand_indicator}
                                                        </Badge>
                                                    </div>
                                                    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                                                        <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">Price Forecast</span>
                                                        <div className="flex items-center gap-1.5 text-white font-medium text-sm">
                                                            {insight.price_forecast?.includes('Rise') ? <ArrowUpRight className="w-4 h-4 text-orange-400" /> : 
                                                             insight.price_forecast?.includes('Drop') ? <ArrowDownRight className="w-4 h-4 text-green-400" /> : 
                                                             <Clock className="w-4 h-4 text-blue-400" />}
                                                            {insight.price_forecast}
                                                        </div>
                                                    </div>
                                                    <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                                                        <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">vs MSP</span>
                                                        <span className={`text-sm font-bold ${insight.msp_comparison?.includes('Above') ? 'text-green-400' : 'text-blue-400'}`}>
                                                            {insight.msp_comparison}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl mb-6">
                                                    <p className="text-slate-300 italic text-sm leading-relaxed">
                                                        "{insight.analysis_brief}"
                                                    </p>
                                                </div>

                                                <div className="space-y-4">
                                                    {insight.insights.map((item, idx) => {
                                                        const Icon = item.type.includes('Trend') ? TrendingUp : 
                                                                     item.type.includes('Strategy') ? Star : 
                                                                     item.type.includes('Logistics') ? Truck : Leaf;
                                                        return (
                                                            <div key={idx} className="flex gap-4 p-4 bg-slate-950/40 rounded-xl border border-slate-800 group hover:border-blue-500/30 transition-all">
                                                                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                                    <Icon className="w-5 h-5 text-blue-400" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <h4 className="text-sm font-bold text-white tracking-wide">{item.type}</h4>
                                                                    <p className="text-xs text-slate-400 leading-relaxed">{item.text}</p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="deals">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-green-400" />
                                    {t('buyer.tabs.deals')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {interactions.length === 0 ? (
                                        <div className="text-slate-500 italic text-center py-8">{t('buyer.noDeals')}</div>
                                    ) : (
                                        interactions.map((int, i) => (
                                            <div key={i} className="flex justify-between items-center p-4 bg-slate-800/30 rounded-lg border border-slate-700 transition-hover hover:bg-slate-800/50">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded shadow-inner bg-green-500/10 flex items-center justify-center">
                                                        <Phone className="w-5 h-5 text-green-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white text-lg">{int.crop} Lead</h4>
                                                        <p className="text-sm text-slate-400">{t('buyer.card.farmer')}: {int.farmerName}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-500 mb-1">
                                                        {int.timestamp 
                                                            ? (typeof int.timestamp === 'object' && int.timestamp !== null && 'toDate' in int.timestamp 
                                                                ? (int.timestamp as { toDate: () => Date }).toDate().toLocaleDateString()
                                                                : new Date(int.timestamp as string).toLocaleDateString())
                                                            : new Date().toLocaleDateString()}
                                                    </p>
                                                    <Badge className="bg-green-900/40 text-green-400 border-green-800">Contacted</Badge>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

export default BuyerDashboard;

