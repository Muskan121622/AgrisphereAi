
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldAlert, CloudRain, Flame, Droplets, Zap, Sprout, MapPin, Phone } from "lucide-react";
import { indianStates } from "@/data/indian_locations.ts";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const WeatherAlerts = () => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [state, setState] = useState("");
    const [district, setDistrict] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [riskData, setRiskData] = useState<any>(null);

    // Load user profile phone on mount
    useEffect(() => {
        const { user } = useAuthStore.getState();
        if (user?.email) {
            try {
                const savedProfile = localStorage.getItem(`profile_${user.email}`);
                if (savedProfile) {
                    const parsed = JSON.parse(savedProfile);
                    if (parsed.phone) setPhone(parsed.phone);
                    if (parsed.state) setState(parsed.state);
                    if (parsed.district) setDistrict(parsed.district);
                }
            } catch (e) {
                console.error("Failed to load profile", e);
            }
        }
    }, []);

    const verifyPhoneNumber = async () => {
        if (!phone) return;
        setVerifying(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/verify-phone`, { phone });
            if (res.data.success) {
                toast({
                    title: t('weather.toasts.verifyTitle'),
                    description: t('weather.toasts.verifyDesc', { code: res.data.validation_code }),
                    className: "bg-blue-600 text-white border-none text-lg p-6",
                    duration: 10000
                });
            } else {
                toast({ title: t('weather.toasts.verifyFailed'), description: res.data.error, variant: "destructive" });
            }
        } catch (e) {
            toast({ title: t('common.error'), description: t('weather.toasts.verifyFailed'), variant: "destructive" });
        } finally {
            setVerifying(false);
        }
    };

    const checkRisk = async () => {
        if (!state || !district) {
            toast({
                title: t('marketplace.advisory.missingInfo'),
                description: t('marketplace.advisory.selectPrompt'),
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        try {
            // Using the new /weather/alert endpoint
            const response = await axios.post(`${API_BASE_URL}/weather/alert`, {
                city: district, // Using district as city for simplicity
                state: state,
                phone: phone
            });

            setRiskData(response.data);

            if (response.data.risk.risk_level !== 'Safe') {
                toast({
                    title: t('weather.toasts.riskTitle'),
                    description: response.data.alerts?.sms_sent
                        ? t('weather.toasts.smsSent', { phone: phone })
                        : t('weather.riskDetected'),
                    variant: "destructive"
                });
            } else {
                toast({
                    title: t('weather.toasts.safeTitle'),
                    description: response.data.alerts?.sms_sent
                        ? t('weather.toasts.smsSent', { phone: phone })
                        : t('weather.toasts.safeDesc'),
                    className: "bg-green-600 text-white border-none shadow-lg"
                });
            }

        } catch (error) {
            console.error("Weather Alert Error:", error);
            toast({
                title: t('common.error'),
                description: t('marketplace.trends.fetchError'),
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-primary/30">
            <Navbar />

            <main className="container mx-auto px-4 py-24 max-w-4xl">
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-red-500/10 mb-4 animate-pulse">
                        <ShieldAlert className="w-12 h-12 text-red-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                        {t('weather.title')}
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        {t('weather.subtitle')}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Control Panel */}
                    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm h-fit">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <MapPin className="text-indigo-400" /> {t('weather.locationTitle')}
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                {t('weather.locationDesc')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">{t('marketplace.advisory.state')}</label>
                                <Select onValueChange={(val) => { setState(val); setDistrict(""); }}>
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-11">
                                        <SelectValue placeholder={t('weather.selectState')} />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px] bg-slate-900 border-slate-700 text-white">
                                        {Object.keys(indianStates).map((s) => (
                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">{t('marketplace.advisory.district')}</label>
                                <Select disabled={!state} onValueChange={setDistrict}>
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-11">
                                        <SelectValue placeholder={t('weather.selectDistrict')} />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px] bg-slate-900 border-slate-700 text-white">
                                        {state && indianStates[state]?.map((d) => (
                                            <SelectItem key={d} value={d}>{d}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 flex justify-between">
                                    {t('weather.phoneLabel')}
                                    <span className="text-xs text-slate-500 font-normal">{t('common.offline')}</span>
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                                    <Input
                                        placeholder="+91 9876543210"
                                        className="pl-9 bg-slate-800 border-slate-700 text-white h-11"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="absolute right-1 top-1 h-9 bg-slate-700 text-slate-300 hover:text-white border-none"
                                        onClick={verifyPhoneNumber}
                                        disabled={verifying || !phone}
                                    >
                                        {verifying ? t('weather.phoneCalling') : t('weather.phoneVerify')}
                                    </Button>
                                </div>
                            </div>

                            <Button
                                className="w-full h-12 text-lg font-bold bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg shadow-red-900/20"
                                onClick={checkRisk}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Zap className="mr-2 h-5 w-5 animate-spin" />
                                        {t('weather.scanning')}
                                    </>
                                ) : (
                                    t('weather.scanBtn')
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Result Display */}
                    <div className="space-y-6">
                        {riskData ? (
                            <Card className={cn("border-2 shadow-2xl relative overflow-hidden transition-all duration-500 animate-in fade-in slide-in-from-bottom-4",
                                riskData.risk.risk_level === 'Critical' ? "bg-red-950/30 border-red-500" :
                                    riskData.risk.risk_level === 'Warning' ? "bg-orange-950/30 border-orange-500" :
                                        "bg-green-950/30 border-green-500"
                            )}>
                                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                    {riskData.risk.risk_level === 'Critical' && <ShieldAlert className="w-64 h-64 text-red-500" />}
                                    {riskData.risk.risk_level === 'Safe' && <Sprout className="w-64 h-64 text-green-500" />}
                                </div>

                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-3xl font-black uppercase tracking-wider text-white">
                                            {riskData.risk.risk_level === 'Safe' ? t('weather.systemSafe') : `${riskData.risk.risk_level} ${t('weather.alert')}`}
                                        </CardTitle>
                                        <Badge variant={riskData.risk.risk_level === 'Safe' ? 'default' : 'destructive'} className="text-lg px-3 py-1">
                                            {riskData.risk.risk_level}
                                        </Badge>
                                    </div>
                                    <CardDescription className="text-slate-200 text-lg font-medium mt-2">
                                        {riskData.risk.alert_message}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-black/20 p-4 rounded-xl backdrop-blur-md">
                                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                                <Flame className="w-4 h-4" /> {t('weather.temp')}
                                            </div>
                                            <div className="text-2xl font-bold text-white">{riskData.risk.details.temp}°C</div>
                                        </div>
                                        <div className="bg-black/20 p-4 rounded-xl backdrop-blur-md">
                                            <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                                <Droplets className="w-4 h-4" /> {t('weather.humidity')}
                                            </div>
                                            <div className="text-2xl font-bold text-white">{riskData.risk.details.humidity}%</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            // Placeholder State
                            <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/20 text-slate-500 space-y-4">
                                <div className="bg-slate-900 p-4 rounded-full">
                                    <ShieldAlert className="w-12 h-12 opacity-50" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-slate-400">{t('weather.standby')}</h3>
                                    <p className="max-w-xs mx-auto mt-2 text-sm">
                                        {t('weather.placeholder')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WeatherAlerts;
