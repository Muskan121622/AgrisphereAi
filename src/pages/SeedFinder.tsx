import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    MapPin, Search, Sprout, Landmark, Store, FileText,
    Navigation, Phone, ShieldCheck, CheckCircle, AlertCircle, Link
} from "lucide-react";
import { SHOP_DATA, REQUIRED_DOCUMENTS, SEED_RECOMMENDATIONS } from "@/data/shopsData";
import { NearbySuppliersMap } from "@/components/NearbySuppliersMap";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const SeedFinder = () => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("locator");
    const [shopFilter, setShopFilter] = useState<"All" | "Government" | "Private">("All");

    // Seed Advisor State
    const [selectedSeason, setSelectedSeason] = useState<string>("");

    const [userLocation, setUserLocation] = useState<{ city: string; state: string } | null>(null);
    const [shops, setShops] = useState(SHOP_DATA);

    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            toast({ title: t('common.error'), description: t('common.error'), variant: "destructive" });
            return;
        }

        toast({ title: t('seeds.toasts.locating'), description: t('seeds.toasts.locatingDesc') });

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                // Reverse Geocoding using OpenStreetMap (Free, No Key)
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();

                const city = data.address.city || data.address.town || data.address.village || "Unknown Location";
                const state = data.address.state || "India";
                const pincode = data.address.postcode;

                setUserLocation({ city, state });

                // Fetch REAL shops from our backend proxy
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const shopResponse = await fetch(`${API_URL}/nearby-suppliers?lat=${latitude}&lng=${longitude}`);
                const fetchedShops = await shopResponse.json();

                if (Array.isArray(fetchedShops)) {
                    setShops(fetchedShops.map(s => ({
                        ...s,
                        phone: s.phone || '+91 1800-11-2345',
                        availableSeeds: s.availableSeeds || ['Certified Seeds', 'Fertilizer']
                    })));

                    toast({
                        title: t('seeds.toasts.found'),
                        description: t('seeds.toasts.foundDesc', { city, state }),
                        className: "bg-green-600 text-white border-none"
                    });
                }

            } catch (error) {
                console.error("Geocoding failed", error);
                toast({ title: t('common.error'), description: t('seeds.toasts.errorLoc'), variant: "destructive" });
            }
        }, (error) => {
            console.error("Geolocation error", error);
            toast({ title: t('seeds.toasts.permDenied'), description: t('seeds.toasts.permDeniedDesc'), variant: "destructive" });
        });
    };

    const filteredShops = shops.filter(shop => {
        const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shop.availableSeeds.some(seed => seed.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesFilter = shopFilter === "All" || shop.type === shopFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-green-500/30">
            <Navbar />

            <main className="container mx-auto px-4 py-24 max-w-6xl">
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium mb-3 border border-green-500/20">
                            <Link className="w-4 h-4" /> {t('seeds.heroBadge')}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
                            {t('seeds.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">{t('seeds.titleProcurement')}</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl">
                            {t('seeds.heroDescription')}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="border-slate-700 hover:bg-slate-800 gap-2 h-12"
                            onClick={() => window.open("https://seednet.gov.in/", "_blank")}
                        >
                            <Search className="w-4 h-4" /> {t('seeds.verifySeedNet')}
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white gap-2 h-12" onClick={handleLocateMe}>
                            <Navigation className="w-4 h-4" /> {t('seeds.locateShops')}
                        </Button>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList className="bg-slate-900 border border-slate-800 p-1 h-14">
                        <TabsTrigger value="locator" className="h-12 px-6 data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400 text-base">
                            <MapPin className="w-4 h-4 mr-2" /> {t('seeds.tabs.findShops')}
                        </TabsTrigger>
                        <TabsTrigger value="advisor" className="h-12 px-6 data-[state=active]:bg-green-600 data-[state=active]:text-white text-slate-400 text-base">
                            <Sprout className="w-4 h-4 mr-2" /> {t('seeds.tabs.advisor')}
                        </TabsTrigger>
                    </TabsList>

                    {/* SHOP LOCATOR TAB */}
                    <TabsContent value="locator" className="space-y-6">
                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                                <Input
                                    placeholder={t('seeds.searchPlaceholder')}
                                    className="pl-10 h-12 bg-slate-900 border-slate-800 text-white text-lg focus:ring-green-500/50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={shopFilter === "All" ? "default" : "outline"}
                                    onClick={() => setShopFilter("All")}
                                    className={shopFilter === "All" ? "bg-slate-800" : "border-slate-800 text-slate-400"}
                                >
                                    {t('seeds.all')}
                                </Button>
                                <Button
                                    variant={shopFilter === "Government" ? "default" : "outline"}
                                    onClick={() => setShopFilter("Government")}
                                    className={shopFilter === "Government" ? "bg-orange-600 hover:bg-orange-700" : "border-slate-800 text-slate-400"}
                                >
                                    <Landmark className="w-4 h-4 mr-2" /> {t('seeds.govtSubsidized')}
                                </Button>
                                <Button
                                    variant={shopFilter === "Private" ? "default" : "outline"}
                                    onClick={() => setShopFilter("Private")}
                                    className={shopFilter === "Private" ? "bg-blue-600 hover:bg-blue-700" : "border-slate-800 text-slate-400"}
                                >
                                    <Store className="w-4 h-4 mr-2" /> {t('seeds.private')}
                                </Button>
                            </div>
                        </div>
                        
                        {/* Interactive Map */}
                        <div className="w-full mb-6">
                            <NearbySuppliersMap 
                                suppliers={filteredShops as any} 
                                userLocation={userLocation ? { lat: (userLocation as any).lat || 25.8673, lng: (userLocation as any).lng || 85.7766 } : undefined} 
                            />
                        </div>

                        {/* Shop Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredShops.map((shop) => (
                                <Card key={shop.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all group">
                                    <CardHeader>
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="outline" className={`
                                                ${shop.type === 'Government' ? 'border-orange-500/50 text-orange-400 bg-orange-500/10' : 'border-blue-500/50 text-blue-400 bg-blue-500/10'}
                                            `}>
                                                {shop.type === 'Government' ? t('seeds.govtSubsidized') : t('seeds.private')}
                                            </Badge>
                                            <span className="text-slate-400 text-sm flex items-center gap-1">
                                                <Navigation className="w-3 h-3" /> {shop.distance} {t('seeds.unit.km')}
                                            </span>
                                        </div>
                                        <CardTitle className="text-xl text-white group-hover:text-green-400 transition-colors">
                                            {shop.name}
                                        </CardTitle>
                                        <CardDescription className="text-slate-400 flex items-start gap-2 mt-1">
                                            <MapPin className="w-4 h-4 mt-0.5 shrink-0" /> {shop.address}
                                        </CardDescription>

                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {shop.ai_tags?.map((tag: string, i: number) => (
                                                <Badge key={i} className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/50">
                                                    {tag === 'Lowest Price' ? `🔥 ${t('seeds.tags.lowestPrice')}` : tag === 'Nearest' ? `📍 ${t('seeds.tags.nearest')}` : tag}
                                                </Badge>
                                            ))}
                                            {shop.blockchain_verified && (
                                                <Badge className="bg-blue-500/20 text-blue-500 border border-blue-500/50">
                                                    ⛓️ {t('seeds.tags.blockchainVerified')}
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        
                                        <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                            <div>
                                                <p className="text-xs text-slate-400">{t('seeds.currentPrice')}</p>
                                                <p className="text-lg font-bold text-white">{shop.price || t('seeds.marketRate')}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-slate-400">{t('seeds.rating')}</p>
                                                <p className="font-semibold text-yellow-500">⭐ {shop.rating || '4.0'}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-sm font-semibold text-slate-300">{t('seeds.inStock')}</p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${shop.stock === 'Out of Stock' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                                    {shop.stock === 'Out of Stock' ? t('seeds.outOfStock') : t('seeds.inStock')}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {shop.availableSeeds.map((seed: string, idx: number) => (
                                                    <Badge key={idx} variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700">
                                                        {seed}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        {(shop.subsidies || shop.subsidy_available) && (
                                            <div className="bg-green-900/20 border border-green-900/50 p-3 rounded-lg">
                                                <p className="text-green-400 text-sm font-medium flex items-center gap-2">
                                                    <ShieldCheck className="w-4 h-4" /> {t('seeds.subsidyAvailable')}
                                                </p>
                                                <p className="text-slate-400 text-xs mt-1">{shop.subsidies ? shop.subsidies.join(", ") : 'Check with store'}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-3 pt-4 border-t border-slate-800">
                                        <Button 
                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}`, '_blank')}
                                        >
                                            <Navigation className="w-4 h-4 mr-2" /> {t('seeds.viewRoute')}
                                        </Button>
                                        <div className="flex w-full gap-3">
                                            <Button variant="outline" className="flex-1 border-slate-700 hover:bg-slate-800">
                                                <Phone className="w-4 h-4 mr-2" /> {t('seeds.call')}
                                            </Button>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white">
                                                        <FileText className="w-4 h-4 mr-2" /> {t('seeds.docsNeeded')}
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-slate-950 border-slate-800 text-white">
                                                    <DialogHeader>
                                                        <DialogTitle>{t('seeds.requiredDocs')}</DialogTitle>
                                                        <DialogDescription className="text-slate-400">
                                                            {t('seeds.carryDocs', { shopName: shop.name })}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4 mt-4">
                                                        {REQUIRED_DOCUMENTS[shop.type as keyof typeof REQUIRED_DOCUMENTS]?.map((doc, idx) => (
                                                            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800">
                                                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                                                <div>
                                                                    <p className="font-semibold text-white">{doc.name}</p>
                                                                    <p className="text-sm text-slate-400">{doc.description}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* SEED ADVISOR TAB */}
                    <TabsContent value="advisor">
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Advisor Form */}
                            <Card className="bg-slate-900 border-slate-800 h-fit">
                                <CardHeader>
                                    <CardTitle className="text-white">{t('seeds.advisorTitle')}</CardTitle>
                                    <CardDescription className="text-slate-400">
                                        {t('seeds.advisorDesc')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300">{t('seeds.selectSeason')}</label>
                                        <Select onValueChange={setSelectedSeason}>
                                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                                <SelectValue placeholder={t('seeds.selectSeason')} />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                                <SelectItem value="Rabi">{t('seeds.seasonRabi')}</SelectItem>
                                                <SelectItem value="Kharif">{t('seeds.seasonKharif')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                        <p className="text-xs text-slate-400 flex gap-2">
                                            <AlertCircle className="w-4 h-4 text-blue-400" />
                                            {t('seeds.aiTip')}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Results Area */}
                            <div className="md:col-span-2 space-y-6">
                                {!selectedSeason ? (
                                    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/20 text-slate-500">
                                        <Sprout className="w-12 h-12 mb-4 opacity-50" />
                                        <p>{t('seeds.selectSeasonPrompt')}</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {SEED_RECOMMENDATIONS[selectedSeason]?.map((rec, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-green-500/50 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 font-bold text-lg">
                                                        {rec.crop[0]}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg text-white">{rec.crop} <span className="text-slate-500 font-normal">({rec.variety})</span></h3>
                                                        <p className="text-green-400 text-sm mt-1">{rec.feature}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xl font-bold text-white mb-1">{rec.price}</div>
                                                    <Button size="sm" variant="outline" className="border-slate-700 hover:bg-slate-800 text-xs h-8">
                                                        {t('seeds.checkAvailability')}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

export default SeedFinder;
