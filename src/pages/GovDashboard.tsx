import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { Users, AlertTriangle, Sprout, Building2, FileText, CheckCircle, XCircle, Search, Activity, Tractor } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import { useTranslation } from 'react-i18next';
import { getGovStatsAggregation, updateCaseStatus, getPosts } from '@/services/firebaseService';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface GovStats {
    overview: {
        totalFarmers: number;
        activeFarmers: number;
        diseaseDetections: number;
        pestAlerts: number;
        fieldsMapped: number;
    };
    market: {
        totalListings: number;
        totalVolume: number;
        listings: any[];
    };
    community: {
        totalIssues: number;
        resolvedIssues: number;
        recenttopics: {
            id: string;
            title: string;
            content: string;
            author: string;
            timestamp: string;
            likes: number;
            replies: number;
        }[];
    };
    cropLoss: {
        pendingCases: number;
        totalDisbursed: number;
    };
}

interface CropLossCase {
    id: string;
    farmerName: string;
    crop: string;
    damagePercentage: number;
    cause: string;
    status: string;
    timestamp: string;
    location: string;
    estimatedLoss: number;
    suggestedCompensation: number;
    isEligible?: boolean;
    suggestedScheme?: string;
}

const GovDashboard = () => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [stats, setStats] = useState<GovStats | null>(null);
    const [cases, setCases] = useState<CropLossCase[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Pulse every minute
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const govStats = await getGovStatsAggregation();
            const communityPosts = await getPosts();
            
            // Fetch cases manually
            const casesRes = await getDocs(collection(db, "cases"));
            const fetchedCases = casesRes.docs.map(d => ({
                id: d.id,
                ...d.data(),
                timestamp: d.data().createdAt?.toDate?.()?.toISOString() || d.data().createdAt || new Date().toISOString()
            })) as any[];

            setStats({
                ...govStats,
                community: {
                    totalIssues: communityPosts.length,
                    resolvedIssues: Math.round(communityPosts.length * 0.4),
                    recenttopics: communityPosts.slice(0, 5).map((p: any) => ({
                        id: p.id,
                        title: p.title || 'Untitled Issue',
                        content: p.content || '',
                        author: p.author || 'Anonymous',
                        timestamp: p.timestamp || new Date().toISOString(),
                        likes: p.likes || 0,
                        replies: p.comments?.length || 0
                    }))
                }
            } as any);
            
            setCases(fetchedCases);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching gov data:", error);
            toast({ 
                title: t('common.error'), 
                description: "Cloud Data Sync Failed. Please check your connection.", 
                variant: "destructive" 
            });
            setLoading(false);
        }
    };

    const handleCaseAction = async (id: string, action: 'approve' | 'reject' | 'verify') => {
        try {
            const newStatus = action === 'approve' ? 'Approved' : action === 'reject' ? 'Rejected' : 'Under Verification';
            await updateCaseStatus(id, newStatus);
            toast({
                title: action === 'approve' ? t('gov.caseActions.approved') : action === 'reject' ? t('gov.caseActions.rejected') : t('gov.caseActions.verified'),
                description: t('gov.caseActions.updated', { id })
            });
            fetchData(); // Refresh data
        } catch (error) {
            toast({ title: t('common.error'), description: t('gov.caseActions.errorUpdate'), variant: "destructive" });
        }
    };

    // Chart Data
    const marketPriceData = [
        { name: 'Wheat', price: 2200 },
        { name: 'Rice', price: 1950 },
        { name: 'Maize', price: 1800 },
        { name: 'Potato', price: 1200 },
        { name: 'Onion', price: 2500 },
    ];

    const generatePDFReport = () => {
        if (!stats) return;
        const reportContent = `AGRISPHERE GOVERNMENT REPORT - ${new Date().toLocaleDateString()}\nTotal Farmers: ${stats.overview.totalFarmers}\nActive Alerts: ${stats.overview.pestAlerts}\nPending Cases: ${stats.cropLoss.pendingCases}`;
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report_${Date.now()}.txt`;
        a.click();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
                <Activity className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-xl font-medium animate-pulse">{t('common.loading')} Cloud Workspace...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navbar />

            <main className="container mx-auto px-4 py-8 pt-24">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600 flex items-center gap-3">
                            <Building2 className="text-blue-500" /> {t('gov.title')}
                        </h1>
                        <p className="text-slate-400 mt-2">{t('gov.subtitle')}</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-800 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm text-green-400">{t('gov.operational')}</span>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={generatePDFReport}>{t('gov.genReport')}</Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <StatCard icon={<Users className="text-blue-400" />} title={t('gov.stats.regFarmers')} value={stats?.overview.totalFarmers} subtext={`+${stats?.overview.activeFarmers} ${t('common.active')}`} />
                    <StatCard icon={<AlertTriangle className="text-red-400" />} title={t('gov.stats.activeAlerts')} value={stats?.overview.pestAlerts} subtext={t('gov.stats.activeAlerts')} />
                    <StatCard icon={<Sprout className="text-green-400" />} title={t('gov.stats.cropLossCases')} value={stats?.cropLoss.pendingCases} subtext={t('gov.cases.status.pending')} />
                    <StatCard icon={<Activity className="text-purple-400" />} title={t('gov.stats.estDisbursement')} value={`₹${(stats?.cropLoss.totalDisbursed || 0) / 100000}L`} subtext={t('gov.stats.estDisbursement')} />
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-slate-900 border border-slate-800 p-1">
                        <TabsTrigger value="overview">{t('gov.tabs.overview')}</TabsTrigger>
                        <TabsTrigger value="croploss" className="data-[state=active]:bg-red-600">{t('gov.tabs.cropLoss')} <Badge className="ml-2 bg-white text-red-600">{stats?.cropLoss.pendingCases}</Badge></TabsTrigger>
                        <TabsTrigger value="market">{t('gov.tabs.market')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-slate-900 border-slate-800">
                                <CardHeader>
                                    <CardTitle className="text-white">{t('gov.charts.diseaseTrend')}</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={marketPriceData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                            <XAxis dataKey="name" stroke="#94a3b8" />
                                            <YAxis stroke="#94a3b8" />
                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                                            <Line type="monotone" dataKey="price" stroke="#f87171" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-900 border-slate-800">
                                <CardHeader>
                                    <CardTitle className="text-white">{t('gov.charts.communityIssues')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-[300px] pr-4">
                                        {stats?.community.recenttopics.map((post, i) => (
                                            <div key={i} className="mb-4 p-3 bg-slate-950/50 rounded-lg border border-slate-800 hover:border-slate-700 transition-all">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-semibold text-slate-200 text-sm">{post.title}</h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs text-blue-400 bg-blue-950/30 px-1.5 py-0.5 rounded">{post.author}</span>
                                                            <span className="text-xs text-slate-500">{new Date(post.timestamp).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                    {post.replies > 0 && (
                                                        <Badge variant="secondary" className="bg-slate-800 text-slate-400 text-[10px]">{post.replies} {t('gov.labels.replies')}</Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-400 line-clamp-2 mb-2">{post.content}</p>
                                            </div>
                                        ))}
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="croploss" className="space-y-6">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-white">{t('gov.cases.title')}</CardTitle>
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                            <Input placeholder={t('gov.cases.search')} className="pl-9 bg-slate-950 border-slate-800 w-64" />
                                        </div>
                                        <Button variant="outline" className="border-slate-800 text-slate-400">{t('marketplace.listings.filters')}</Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {cases.length === 0 ? (
                                        <div className="text-center py-12 text-slate-500">{t('gov.cases.noCases')}</div>
                                    ) : (
                                        cases.map((c) => (
                                            <div key={c.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:border-slate-700 transition-colors">
                                                <div className="flex items-start gap-4">
                                                    <div className="bg-slate-900 p-3 rounded-lg">
                                                        <FileText className="text-blue-500 h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-mono text-xs text-slate-500">{c.id}</span>
                                                            <Badge className={
                                                                c.status === 'Approved' ? "bg-green-900/50 text-green-400" :
                                                                    c.status === 'Rejected' ? "bg-red-900/50 text-red-400" :
                                                                        c.status === 'Under Verification' ? "bg-blue-900/50 text-blue-400" :
                                                                            "bg-yellow-900/50 text-yellow-400"
                                                            }>{c.status === 'Approved' ? t('gov.cases.status.approved') : c.status === 'Rejected' ? t('gov.cases.status.rejected') : c.status === 'Under Verification' ? t('gov.cases.status.underVerification') : t('gov.cases.status.pending')}</Badge>
                                                        </div>
                                                        <h3 className="font-semibold text-lg text-slate-200 mt-1">{c.farmerName} • {c.crop} {t('gov.labels.loss')}</h3>
                                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400 mt-1">
                                                            <span>{t('gov.labels.cause')}: {c.cause}</span>
                                                            <span className="text-red-400 font-medium">{t('gov.labels.damage')}: {c.damagePercentage}%</span>
                                                            <span>{t('gov.labels.estLoss')}: ₹{c.estimatedLoss}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {!['Approved', 'Rejected'].includes(c.status) && (
                                                    <div className="flex gap-2 w-full md:w-auto">
                                                        {c.status !== 'Under Verification' && (
                                                            <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 flex-1" onClick={() => handleCaseAction(c.id, 'verify')}>
                                                                {t('gov.cases.verify')}
                                                            </Button>
                                                        )}
                                                        <Button size="sm" className="bg-red-900/50 text-red-300 hover:bg-red-900/80 border border-red-900 flex-1" onClick={() => handleCaseAction(c.id, 'reject')}>
                                                            {t('gov.cases.reject')}
                                                        </Button>
                                                        <Button size="sm" className="bg-green-600 hover:bg-green-700 flex-1" onClick={() => handleCaseAction(c.id, 'approve')}>
                                                            {t('gov.cases.approve')}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="market" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-slate-900 border-slate-800">
                                <CardHeader>
                                    <CardTitle className="text-white">{t('gov.charts.prices')}</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={marketPriceData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                            <XAxis type="number" stroke="#94a3b8" />
                                            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} />
                                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                                            <Bar dataKey="price" fill="#60a5fa" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                            <Card className="bg-slate-900 border-slate-800">
                                <CardHeader>
                                    <CardTitle className="text-white">{t('gov.charts.listings')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {stats?.market.listings.map((l, i) => (
                                            <div key={i} className="flex justify-between items-center p-3 border-b border-slate-800 last:border-0">
                                                <div>
                                                    <p className="font-medium text-slate-200">{l.cropName || l.title}</p>
                                                    <p className="text-xs text-slate-500">{l.location || 'Unknown'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-green-400">₹{l.price}/Q</p>
                                                    <p className="text-xs text-slate-400">{l.quantity || 0} Q</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

const StatCard = ({ icon, title, value, subtext }: { icon: any, title: string, value: any, subtext: string }) => (
    <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-800 rounded-lg">
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-slate-400">{title}</p>
                    <h3 className="text-2xl font-bold text-white">{value || '0'}</h3>
                    <p className="text-xs text-slate-500 mt-1">{subtext}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);

export default GovDashboard;
