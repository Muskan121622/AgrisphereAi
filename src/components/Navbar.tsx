import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuthStore } from "@/store/authStore";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Settings,
  LogOut,
  MapPin,
  Loader2,
  Briefcase,
  Camera,
  User,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { indianStates } from "@/data/indian_locations.ts";
import { API_BASE_URL } from "@/config/api.ts";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { saveUserProfile, getUserProfile } from "@/services/firebaseService";
import { toast } from "sonner";

const Navbar = ({ minimal = false }: { minimal?: boolean }) => {
  const { isAuthenticated, logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const userRole = user?.role;
  const isGov = userRole === "government";
  const isBuyer = userRole === "buyer";
  const isFarmer = isAuthenticated && !isGov && !isBuyer;

  const mainLinks = [
    { name: t("nav.home"), path: "/", public: true, buyer: true },
    {
      name: t("nav.buyerDashboard"),
      path: "/buyer/dashboard",
      public: false,
      gov: false,
      buyer: true,
    },
    {
      name: t("nav.dashboard", "Dashboard"),
      path: "/comprehensive-dashboard",
      public: false,
      gov: false,
      buyer: false,
    },
    {
      name: t("nav.marketplace"),
      path: "/marketplace",
      public: false,
      gov: false,
      buyer: false,
    },
    {
      name: t("nav.communityForum"),
      path: "/community",
      public: false,
      gov: false,
      buyer: false,
    },
    {
      name: t("nav.advisoryHub"),
      path: "/advisory-hub",
      public: false,
      gov: false,
      buyer: false,
    },
    {
      name: t("nav.adminDashboard"),
      path: "/gov/dashboard",
      public: false,
      gov: true,
      buyer: false,
    },
  ].filter((item) => {
    if (item.public) return !isAuthenticated;
    if (!isAuthenticated) return false;
    if (isGov)
      return item.gov === true || (item.public && item.name === t("nav.home"));
    if (isBuyer)
      return (
        item.buyer === true || (item.public && item.name === t("nav.home"))
      );
    return item.gov === false && item.buyer !== true;
  });

  const aiTools = [
    { name: t("nav.diseaseDetection"), path: "/disease-detection" },
    { name: t("nav.yieldPrediction"), path: "/yield-prediction" },
    { name: t("nav.digitalTwin"), path: "/digital-twin" },
    { name: t("nav.voiceAssistant"), path: "/voice-assistant" },
    {
      name: t("nav.fertilizerAi"),
      path: "/fertilizer-recommendation",
    },
    { name: t("nav.pestForecast"), path: "/pest-prediction" },
    {
      name: t("nav.seedFinder", "Seed Finder"),
      path: "/seed-finder",
    },
    {
      name: t("nav.traceability", "Web3 Traceability"),
      path: "/traceability",
    },
  ];

  const isAiToolsActive = aiTools.some(
    (tool) =>
      location.pathname.replace(/\/+$/, "") === tool.path.replace(/\/+$/, ""),
  );

  const isLinkActive = (path: string) =>
    location.pathname.replace(/\/+$/, "") === path.replace(/\/+$/, "");

  const isAiToolActive = (path: string) =>
    location.pathname.replace(/\/+$/, "") === path.replace(/\/+$/, "");

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl ${minimal ? "h-16" : ""}`}>
        <div className="container mx-auto px-4 h-full flex items-center justify-between gap-4">
          {!minimal && (
            <div
              className="flex items-center gap-2 cursor-pointer shrink-0"
              onClick={() => navigate("/")}
            >
              <img
                src="/Screenshot 2025-11-21 114200.png"
                alt="AgriSphere AI Logo"
                className="w-10 h-10 rounded-full object-cover shadow-glow-primary border-2 border-primary/30"
              />
              <span className="text-xl font-bold gradient-text">
                AgriSphere AI
              </span>
            </div>
          )}

          {minimal && (
             <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
               <span className="text-sm font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                 ← {t("nav.home")}
               </span>
             </div>
          )}

          {!minimal && (
            <nav className="flex flex-1 min-w-0 items-center gap-2 overflow-x-auto whitespace-nowrap py-1">
              {mainLinks.map((item, i) => (
                <div key={item.name} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => navigate(item.path)}
                    className={`group relative inline-flex items-center rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                      isLinkActive(item.path)
                        ? "bg-primary/10 text-foreground shadow-sm"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {item.name}
                    <span
                      className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-green-500 transition-transform duration-300 ${
                        isLinkActive(item.path)
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </button>
                </div>
              ))}

              {isFarmer && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={`group relative inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-2 text-sm font-medium outline-none transition-colors ${
                      isAiToolsActive
                        ? "bg-primary/10 text-foreground"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-primary" />
                    {t("nav.aiTools")}
                    <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
                    <span
                      className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-green-500 transition-transform duration-300 ${
                        isAiToolsActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="bg-background/95 backdrop-blur-xl border-border/50 min-w-[200px]"
                    align="start"
                  >
                    {aiTools.map((tool) => (
                      <DropdownMenuItem
                        key={tool.name}
                        className={`cursor-pointer transition-colors ${
                          isAiToolActive(tool.path)
                            ? "bg-green-500/10 text-green-600 font-semibold"
                            : "hover:bg-primary/10"
                        }`}
                        onClick={() => navigate(tool.path)}
                      >
                        {tool.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>
          )}

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
            <LanguageSwitcher />
            <ThemeToggle />
            {!isAuthenticated && (
              <>
                <Button
                  variant="outline"
                  className="inline-flex text-xs sm:text-sm px-2 sm:px-3"
                  onClick={() => navigate("/login")}
                >
                  {t("nav.login")}
                </Button>
                <Button
                  className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 text-xs sm:text-sm px-2 sm:px-4"
                  onClick={() => navigate("/signup")}
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
      </header>
    </>
  );
};


// Internal Component for User Profile
const UserProfileMenu = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const defaultProfileImage = "/images/farmer.png";
  
  interface UserProfile {
    name: string;
    email: string;
    bio: string;
    photoUrl: string;
    dob: string;
    country: string;
    state: string;
    district: string;
    village: string;
    city: string;
    farmSize: string;
    experience: string;
    crops: string;
    phone: string;
    farmerType: "Small" | "Marginal" | "Large";
    // Buyer Fields
    company?: string;
    license?: string;
    gst?: string;
    interests?: string;
  }

  // Extended Profile State
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || "Farmer_User",
    email: user?.email || "",
    bio: "Passionate farmer.",
    photoUrl: user?.avatar || defaultProfileImage,
    dob: "",
    country: "India",
    state: "",
    district: "",
    village: "",
    city: "",
    farmSize: "",
    experience: "",
    crops: "",
    phone: "",
    farmerType: "Small",
    // Buyer Fields
    company: "",
    license: "",
    gst: "",
    interests: "",
  });

  const API_URL = API_BASE_URL;

  // Sync from Firebase on Open
  useEffect(() => {
    const loadProfile = async () => {
      if (isOpen && user?.id) {
        try {
          const cloudProfile = await getUserProfile(user.id);
          if (cloudProfile) {
            setProfile((prev) => ({
              ...prev,
              ...cloudProfile,
              name: cloudProfile.name || prev.name,
              email: cloudProfile.email || prev.email,
              photoUrl: cloudProfile.photoUrl || prev.photoUrl,
            }));
          }
        } catch (err) {
          console.error("Failed to load profile from Firestore", err);
          toast.error("Failed to load profile from cloud.");
        }
      }
    };
    loadProfile();
  }, [isOpen, user?.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGPS = () => {
    setIsLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Use OpenStreetMap Nominatim for free reverse geocoding
            const res = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            );
            const address = res.data.address;

            // Extract village/town/city
            const village =
              address.village ||
              address.town ||
              address.city ||
              address.suburb ||
              "";
            const city = address.city || address.town || address.village || "";
            const country = address.country || "India";
            const state = address.state || "";
            const district = address.state_district || address.county || "";

            setProfile((prev) => ({
              ...prev,
              village: village,
              city: city || prev.city,
              country: country || prev.country,
              // Try to auto-match state/district if exact match found
              state:
                Object.keys(indianStates).find((s) => s === state) ||
                prev.state,
              district: district || prev.district, // Allow manual override if mismatch
            }));
          } catch (error) {
            console.error("GPS Error", error);
            alert("Failed to fetch address from GPS. Please enter manually.");
          } finally {
            setIsLoadingLocation(false);
          }
        },
        (error) => {
          console.error("Geolocation error", error);
          setIsLoadingLocation(false);
          alert("Location access denied or unavailable.");
        },
      );
    } else {
      setIsLoadingLocation(false);
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      toast.loading("Saving profile to cloud...");
      
      // Save to Firestore
      await saveUserProfile(user.id, {
        ...profile,
        username: profile.name,
        role: user.role,
      });

      // Maintain minor localStorage for very fast UI fallbacks and community cross-compat
      localStorage.setItem("agrisphere_username", profile.name);
      localStorage.setItem("agrisphere_email", profile.email);
      localStorage.setItem(`profile_${user.id}_cached`, "true");
      
      // PERSIST FOR SEED FINDER & ADVISORY HUB
      // These keys are used by getProfileLocation in profile-utils.ts and state in AdvisoryHub.tsx
      const emailKey = user.email;
      if (emailKey) {
        localStorage.setItem(`profile_${emailKey}_state`, profile.state);
        localStorage.setItem(`profile_${emailKey}_district`, profile.district);
        localStorage.setItem(`profile_${emailKey}_village`, profile.village);
        localStorage.setItem(`profile_${emailKey}_city`, profile.city);
        localStorage.setItem(`profile_${emailKey}_country`, profile.country);
        localStorage.setItem(`profile_${emailKey}_farmSize`, profile.farmSize);
        localStorage.setItem(`profile_${emailKey}_farmerType`, profile.farmerType);
      }

      toast.dismiss();
      toast.success("Profile saved successfully!");
      setIsOpen(false);
      
      // We don't necessarily need a full reload now that we have real-time components, 
      // but keeping it for now to ensure all listeners update.
      setTimeout(() => window.location.reload(), 500);
    } catch (e) {
      console.error("Failed to save profile to Firestore", e);
      toast.error("Failed to save profile. Please check your connection.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full hover:bg-white/10"
        >
          <Avatar className="h-9 w-9 border-2 border-primary/40">
            <AvatarImage
              src={profile.photoUrl || defaultProfileImage}
              alt={profile.name}
              className="object-cover"
            />
            <AvatarFallback>{profile.name[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-slate-950 border-slate-800 text-white max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="space-y-2 border-b border-slate-800 pb-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {user?.role === "buyer" ? (
              <Briefcase className="w-5 h-5 text-blue-400" />
            ) : (
              <User className="w-5 h-5 text-green-400" />
            )}
            {user?.role === "buyer"
              ? t("profile.buyerTitle")
              : t("profile.farmerTitle")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 py-5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-slate-800 shadow-xl group-hover:scale-105 transition-transform">
                  <AvatarImage
                    src={profile.photoUrl || defaultProfileImage}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl">
                    {profile.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400">
                  {t("profile.uploadPhoto")}
                </p>
              </div>
            </div>

            {/* Basic Details */}
            <div className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="space-y-2">
                <Label htmlFor="name">{t("profile.fullName")}</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="bg-slate-950 border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">{t("profile.dob")}</Label>
                <Input
                  id="dob"
                  type="date"
                  value={profile.dob}
                  onChange={(e) =>
                    setProfile({ ...profile, dob: e.target.value })
                  }
                  className="bg-slate-950 border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t("profile.phone")}</Label>
                <Input
                  id="phone"
                  placeholder="+91"
                  value={profile.phone || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className="bg-slate-950 border-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("profile.location")}</Label>
                <p className="text-xs text-slate-500">
                  {t(
                    "profile.locationHelp",
                    "Fill the fields below so the map can search shops near your address.",
                  )}
                </p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">
                      {t("profile.state")}
                    </Label>
                    <Select
                      value={profile.state}
                      onValueChange={(val) =>
                        setProfile({ ...profile, state: val })
                      }
                    >
                      <SelectTrigger className="bg-slate-950 border-slate-700">
                        <SelectValue placeholder={t("profile.state")} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] bg-slate-900 border-slate-700 text-white">
                        {Object.keys(indianStates).map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">
                      {t("profile.district")}
                    </Label>
                    <Select
                      value={profile.district}
                      onValueChange={(val) =>
                        setProfile({ ...profile, district: val })
                      }
                      disabled={!profile.state}
                    >
                      <SelectTrigger className="bg-slate-950 border-slate-700">
                        <SelectValue placeholder={t("profile.district")} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] bg-slate-900 border-slate-700 text-white">
                        {profile.state &&
                          indianStates[profile.state]?.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">
                      {t("profile.village")}
                    </Label>
                    <Input
                      placeholder={t("profile.village")}
                      value={profile.village}
                      onChange={(e) =>
                        setProfile({ ...profile, village: e.target.value })
                      }
                      className="bg-slate-950 border-slate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">
                      {t("profile.city")}
                    </Label>
                    <Input
                      placeholder={t("profile.city")}
                      value={profile.city || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, city: e.target.value })
                      }
                      className="bg-slate-950 border-slate-700"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-400">
                      {t("profile.country")}
                    </Label>
                    <Input
                      placeholder={t("profile.country")}
                      value={profile.country || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, country: e.target.value })
                      }
                      className="bg-slate-950 border-slate-700"
                    />
                  </div>
                  <div className="flex items-end justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-2 hover:bg-transparent hover:text-green-400"
                      onClick={handleGPS}
                      disabled={isLoadingLocation}
                      title={t("profile.useGps")}
                    >
                      {isLoadingLocation ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                      {t("profile.useGps")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
              {user?.role === "buyer" ? (
                <>
                  <Label className="text-secondary font-bold flex items-center gap-2">
                    🏢 {t("profile.buyerDetails")}
                  </Label>
                  <p className="text-xs text-slate-500">
                    {t("profile.buyerSubtitle")}
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-400">
                        {t("profile.company")}
                      </Label>
                      <Input
                        placeholder={t("profile.companyPlaceholder")}
                        value={profile.company || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, company: e.target.value })
                        }
                        className="bg-slate-950 border-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-400">
                        {t("profile.license")}
                      </Label>
                      <Input
                        placeholder={t("profile.licensePlaceholder")}
                        value={profile.license || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, license: e.target.value })
                        }
                        className="bg-slate-950 border-slate-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 mt-2">
                    <Label className="text-xs text-secondary font-bold">
                      {t("profile.interests")}
                    </Label>
                    <Input
                      placeholder={t("profile.interestsPlaceholder")}
                      value={profile.interests || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, interests: e.target.value })
                      }
                      className="bg-slate-950 border-slate-700 border-l-4 border-l-secondary"
                    />
                  </div>
                </>
              ) : (
                <>
                  <Label>{t("profile.farmDetails")}</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder={t("profile.farmSize")}
                      type="number"
                      value={profile.farmSize}
                      onChange={(e) =>
                        setProfile({ ...profile, farmSize: e.target.value })
                      }
                      className="bg-slate-950 border-slate-700"
                    />
                    <Select
                      value={profile.farmerType}
                      onValueChange={(val: any) =>
                        setProfile({ ...profile, farmerType: val })
                      }
                    >
                      <SelectTrigger className="bg-slate-950 border-slate-700">
                        <SelectValue placeholder={t("profile.farmerType", "Farmer Type")} />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white">
                        <SelectItem value="Small">Small</SelectItem>
                        <SelectItem value="Marginal">Marginal</SelectItem>
                        <SelectItem value="Large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Input
                      placeholder={t("profile.experience")}
                      type="number"
                      value={profile.experience}
                      onChange={(e) =>
                        setProfile({ ...profile, experience: e.target.value })
                      }
                      className="bg-slate-950 border-slate-700"
                    />
                    <Input
                      placeholder={t("profile.primaryCrops")}
                      value={profile.crops}
                      onChange={(e) =>
                        setProfile({ ...profile, crops: e.target.value })
                      }
                      className="bg-slate-950 border-slate-700"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 flex justify-between bg-slate-900/50 backdrop-blur-sm mt-auto gap-3">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" /> {t("profile.logout")}
          </Button>
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 gap-2"
          >
            <Settings className="w-4 h-4" /> {t("profile.save")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Navbar;
