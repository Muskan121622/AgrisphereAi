
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
    ArrowRight, Settings, LogOut, MapPin, Loader2, 
    Briefcase, Camera, User, ChevronDown, Sparkles 
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import axios from "axios";
import NotificationCenter from "./NotificationCenter";
import { indianStates } from "@/data/indian_locations";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuthStore();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const userRole = user?.role;
    const isFarmer = isAuthenticated && userRole !== 'government' && userRole !== 'buyer';

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
        >
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <motion.div
                    className="flex items-center gap-2 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    onClick={() => navigate('/')}
                >
                    <img
                        src="/Screenshot 2025-11-21 114200.png"
                        alt="AgriSphere AI Logo"
                        className="w-10 h-10 rounded-full object-cover shadow-glow-primary border-2 border-primary/30"
                    />
                    <span className="text-xl font-bold gradient-text">AgriSphere AI</span>
                </motion.div>

                {isFarmer && (
                    <Button
                        variant="outline"
                        className="inline-flex border-primary/30 bg-primary/5 hover:bg-primary/10"
                        onClick={() => navigate('/seed-finder')}
                    >
                        <MapPin className="mr-2 w-4 h-4 text-primary" />
                        Seed Finder
                    </Button>
                )}

                <nav className="hidden xl:flex items-center gap-6">
                    {(() => {
                        const isGov = userRole === 'government';
                        const isBuyer = userRole === 'buyer';

                        const mainLinks = [
                            { name: t("nav.home"), path: "/", public: true, buyer: true },
                            { name: t("nav.buyerDashboard"), path: "/buyer/dashboard", public: false, gov: false, buyer: true },
                            { name: t("nav.marketplace"), path: "/marketplace", public: false, gov: false, buyer: false },
                            { name: t("nav.communityForum"), path: "/community", public: false, gov: false, buyer: false },
                            { name: t("nav.advisoryHub"), path: "/advisory-hub", public: false, gov: false, buyer: false },
                            { name: t("nav.adminDashboard"), path: "/gov/dashboard", public: false, gov: true, buyer: false },
                        ].filter(item => {
                            if (item.public) return !isAuthenticated;
                            if (!isAuthenticated) return false;
                            if (isGov) return item.gov === true || (item.public && item.name === t("nav.home"));
                            if (isBuyer) return item.buyer === true || (item.public && item.name === t("nav.home"));
                            return item.gov === false && item.buyer !== true;
                        });

                        const aiTools = [
                            { name: t("nav.diseaseDetection"), path: "/disease-detection" },
                            { name: t("nav.yieldPrediction"), path: "/yield-prediction" },
                            { name: t("nav.digitalTwin"), path: "/digital-twin" },
                            { name: "Seed Finder", path: "/seed-finder" },
                            { name: t("nav.voiceAssistant"), path: "/voice-assistant" },
                            { name: t("nav.fertilizerAi"), path: "/fertilizer-recommendation" },
                            { name: t("nav.pestForecast"), path: "/pest-prediction" },
                        ];

                        return (
                            <>
                                {mainLinks.map((item, i) => (
                                    <motion.a
                                        key={item.name}
                                        href={item.path}
                                        className="text-foreground/80 hover:text-foreground transition-colors relative group text-sm font-medium"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        {item.name}
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
                                    </motion.a>
                                ))}

                                {isFarmer && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="flex items-center gap-1 text-foreground/80 hover:text-foreground transition-colors text-sm font-medium outline-none group">
                                            <Sparkles className="w-4 h-4 text-primary" />
                                            {t("nav.aiTools")}
                                            <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="bg-background/95 backdrop-blur-xl border-border/50 min-w-[200px]" align="start">
                                            {aiTools.map((tool) => (
                                                <DropdownMenuItem 
                                                    key={tool.name} 
                                                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                                                    onClick={() => navigate(tool.path)}
                                                >
                                                    {tool.name}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </>
                        );
                    })()}
                </nav>

                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    <ThemeToggle />
                    {!isAuthenticated && (
                        <>
                            <Button
                                variant="outline"
                                className="hidden md:inline-flex"
                                onClick={() => navigate('/login')}
                            >
                                {t("nav.login")}
                            </Button>
                            <Button
                                className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300"
                                onClick={() => navigate('/signup')}
                            >
                                {t("nav.getStarted")}
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </>
                    )}
                    {isAuthenticated && (
                        <>
                            <NotificationCenter />
                            <UserProfileMenu />
                        </>
                    )}
                </div>
            </div>
        </motion.header>
    );
};

// Internal Component for User Profile
const UserProfileMenu = () => {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    // Helper function to get user-specific localStorage key
    const getUserKey = (field: string) => {
        const userEmail = user?.email || "default";
        return `profile_${userEmail}_${field}`;
    };

    // Helper function to get user-specific value from localStorage
    const getUserValue = (field: string, defaultValue: string = "") => {
        return localStorage.getItem(getUserKey(field)) || defaultValue;
    };

    // Helper function to set user-specific value in localStorage
    const setUserValue = (field: string, value: string) => {
        localStorage.setItem(getUserKey(field), value);
    };

    // Extended Profile State
    const [profile, setProfile] = useState({
        name: getUserValue("username", user?.name || "Farmer_User"),
        email: user?.email || "",
        bio: getUserValue("bio", "Passionate farmer."),
        photoUrl: getUserValue("photo", user?.avatar || ""),
        dob: getUserValue("dob"),
        country: "India",
        state: getUserValue("state"),
        district: getUserValue("district"),
        village: getUserValue("village"),
        farmSize: getUserValue("farmSize"),
        experience: getUserValue("experience"),
        crops: getUserValue("crops"),
        phone: getUserValue("phone"),
        // Buyer Fields
        company: getUserValue("company"),
        license: getUserValue("license"),
        gst: getUserValue("gst"),
        interests: getUserValue("interests")
    });

    const API_URL = 'http://localhost:5000';

    // Reload Data on Open
    useEffect(() => {
        if (isOpen) {
            setProfile({
                name: getUserValue("username", user?.name || "Farmer_User"),
                email: user?.email || "",
                bio: getUserValue("bio", "Passionate farmer."),
                photoUrl: getUserValue("photo", user?.avatar || ""),
                dob: getUserValue("dob"),
                country: "India",
                state: getUserValue("state"),
                district: getUserValue("district"),
                village: getUserValue("village"),
                farmSize: getUserValue("farmSize"),
                experience: getUserValue("experience"),
                crops: getUserValue("crops"),
                phone: getUserValue("phone"),
                // Buyer Fields
                company: getUserValue("company"),
                license: getUserValue("license"),
                gst: getUserValue("gst"),
                interests: getUserValue("interests")
            });
        }
    }, [isOpen, user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({ ...prev, photoUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGPS = () => {
        setIsLoadingLocation(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    // Use OpenStreetMap Nominatim for free reverse geocoding
                    const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const address = res.data.address;

                    // Extract village/town/city
                    const village = address.village || address.town || address.city || address.suburb || "";
                    const state = address.state || "";
                    const district = address.state_district || address.county || "";

                    setProfile(prev => ({
                        ...prev,
                        village: village,
                        // Try to auto-match state/district if exact match found
                        state: Object.keys(indianStates).find(s => s === state) || prev.state,
                        district: district || prev.district // Allow manual override if mismatch
                    }));
                } catch (error) {
                    console.error("GPS Error", error);
                    alert("Failed to fetch address from GPS. Please enter manually.");
                } finally {
                    setIsLoadingLocation(false);
                }
            }, (error) => {
                console.error("Geolocation error", error);
                setIsLoadingLocation(false);
                alert("Location access denied or unavailable.");
            });
        } else {
            setIsLoadingLocation(false);
            alert("Geolocation is not supported by your browser.");
        }
    };

    const handleSave = async () => {
        // Save to user-specific local storage keys
        setUserValue("username", profile.name);
        setUserValue("email", profile.email);
        setUserValue("bio", profile.bio);
        setUserValue("photo", profile.photoUrl);
        setUserValue("dob", profile.dob);
        setUserValue("state", profile.state);
        setUserValue("district", profile.district);
        setUserValue("village", profile.village);
        setUserValue("farmSize", profile.farmSize);
        setUserValue("experience", profile.experience);
        setUserValue("crops", profile.crops);
        setUserValue("phone", profile.phone);
        // Save Buyer Fields
        setUserValue("company", profile.company);
        setUserValue("license", profile.license);
        setUserValue("gst", profile.gst);
        setUserValue("interests", profile.interests);

        // Also save to old keys for backward compatibility (Community chat username)
        localStorage.setItem("agrisphere_username", profile.name);
        localStorage.setItem("agrisphere_email", profile.email);

        // Save to backend
        try {
            await axios.post(`${API_URL}/user/profile`, {
                username: profile.name,
                email: user?.email,
                ...profile
            });
        } catch (e) {
            console.error("Failed to save profile to backend", e);
        }

        setIsOpen(false);
        // Force reload to update UI components relying on localStorage
        window.location.reload();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
                    <Avatar className="h-9 w-9 border-2 border-primary/40">
                        <AvatarImage src={profile.photoUrl} alt={profile.name} className="object-cover" />
                        <AvatarFallback>{profile.name[0]}</AvatarFallback>
                    </Avatar>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-slate-950 border-slate-800 text-white max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        {user?.role === 'buyer' ? <Briefcase className="w-5 h-5 text-blue-400" /> : <User className="w-5 h-5 text-green-400" />}
                        {user?.role === 'buyer' ? t('home.profile.buyerTitle') : t('home.profile.farmerTitle')}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-4 py-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    <div className="space-y-6">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group">
                                <Avatar className="h-24 w-24 border-4 border-slate-800 shadow-xl group-hover:scale-105 transition-transform">
                                    <AvatarImage src={profile.photoUrl} className="object-cover" />
                                    <AvatarFallback className="text-2xl">{profile.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleFileChange} />
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-slate-400">{t('home.profile.uploadPhoto')}</p>
                            </div>
                        </div>

                        {/* Basic Details */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t('home.profile.fullName')}</Label>
                                <Input id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="bg-slate-950 border-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dob">{t('home.profile.dob')}</Label>
                                <Input id="dob" type="date" value={profile.dob} onChange={(e) => setProfile({ ...profile, dob: e.target.value })} className="bg-slate-950 border-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">{t('home.profile.phone')}</Label>
                                <Input
                                    id="phone"
                                    placeholder="+91"
                                    value={profile.phone || ""}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    className="bg-slate-950 border-slate-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('home.profile.location')}</Label>
                                <Input value={t('common.india')} disabled className="bg-slate-900 border-slate-800 text-slate-500 mb-2" />
                                <div className="grid grid-cols-2 gap-2">
                                    <Select value={profile.state} onValueChange={(val) => setProfile({ ...profile, state: val })}>
                                        <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue placeholder={t('home.profile.state')} /></SelectTrigger>
                                        <SelectContent className="max-h-[200px] bg-slate-900 border-slate-700 text-white">
                                            {Object.keys(indianStates).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <Select value={profile.district} onValueChange={(val) => setProfile({ ...profile, district: val })} disabled={!profile.state}>
                                        <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue placeholder={t('home.profile.district')} /></SelectTrigger>
                                        <SelectContent className="max-h-[200px] bg-slate-900 border-slate-700 text-white">
                                            {profile.state && indianStates[profile.state]?.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="relative mt-2">
                                    <Input
                                        placeholder={t('home.profile.village')}
                                        value={profile.village}
                                        onChange={(e) => setProfile({ ...profile, village: e.target.value })}
                                        className="bg-slate-950 border-slate-700 pr-10"
                                    />
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute right-0 top-0 h-full hover:bg-transparent hover:text-green-400"
                                        onClick={handleGPS}
                                        disabled={isLoadingLocation}
                                        title={t('home.profile.useGps')}
                                    >
                                        {isLoadingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {user?.role === 'buyer' ? (
                                <>
                                    <Label className="text-secondary font-bold flex items-center gap-2">
                                        🏢 {t('home.profile.buyerDetails')}
                                    </Label>
                                    <p className="text-xs text-slate-500">{t('home.profile.buyerSubtitle')}</p>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-slate-400">{t('home.profile.company')}</Label>
                                            <Input placeholder="e.g. Fresh Foods Pvt Ltd" value={profile.company || ""} onChange={(e) => setProfile({ ...profile, company: e.target.value })} className="bg-slate-950 border-slate-700" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-slate-400">{t('home.profile.license')}</Label>
                                            <Input placeholder="License Number" value={profile.license || ""} onChange={(e) => setProfile({ ...profile, license: e.target.value })} className="bg-slate-950 border-slate-700" />
                                        </div>
                                    </div>
                                    <div className="space-y-1 mt-2">
                                        <Label className="text-xs text-secondary font-bold">{t('home.profile.interests')}</Label>
                                        <Input placeholder="e.g. Wheat, Rice, Organic Vegetables" value={profile.interests || ""} onChange={(e) => setProfile({ ...profile, interests: e.target.value })} className="bg-slate-950 border-slate-700 border-l-4 border-l-secondary" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Label>{t('home.profile.farmDetails')}</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input placeholder={t('home.profile.farmSize')} type="number" value={profile.farmSize} onChange={(e) => setProfile({ ...profile, farmSize: e.target.value })} className="bg-slate-950 border-slate-700" />
                                        <Input placeholder={t('home.profile.experience')} type="number" value={profile.experience} onChange={(e) => setProfile({ ...profile, experience: e.target.value })} className="bg-slate-950 border-slate-700" />
                                    </div>
                                    <Input placeholder={t('home.profile.primaryCrops')} value={profile.crops} onChange={(e) => setProfile({ ...profile, crops: e.target.value })} className="bg-slate-950 border-slate-700 mt-2" />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-800 flex justify-between bg-slate-900/50 backdrop-blur-sm mt-auto">
                    <Button variant="destructive" size="sm" onClick={() => { logout(); navigate('/'); }} className="gap-2">
                        <LogOut className="w-4 h-4" /> {t('home.profile.logout')}
                    </Button>
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 gap-2">
                        <Settings className="w-4 h-4" /> {t('home.profile.saveProfile')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Navbar;
