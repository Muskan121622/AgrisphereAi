import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import {
  MessageCircle,
  MessageSquare,
  MapPin,
  Send,
  Star,
  Users,
  Search,
  CheckCircle2,
  Phone
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuthStore } from "@/store/authStore";
import { getFarmersList, sendMessage, getMessagesStream } from "@/services/firebaseService";

type FarmerCard = {
  id: string;
  name: string;
  address?: string;
  village?: string;
  photoUrl?: string;
  role?: string;
};

type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: any;
  participants: string[];
};

const CommunityFeed = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [farmers, setFarmers] = useState<FarmerCard[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerCard | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("feed");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const data = await getFarmersList();
        setFarmers(data as FarmerCard[]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching farmers:", error);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!user || !selectedFarmer) {
      setMessages([]);
      return;
    }

    const unsubscribe = getMessagesStream(user.id, selectedFarmer.id, (msgs) => {
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user, selectedFarmer]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!messageText.trim() || !selectedFarmer || !user) return;

    try {
      const payload = {
        senderId: user.id,
        senderName: user.name,
        recipientId: selectedFarmer.id,
        text: messageText,
        participants: [user.id, selectedFarmer.id]
      };
      await sendMessage(payload);
      setMessageText("");
    } catch (error) {
      toast({
        title: t('common.error'),
        description: "Message delivery failed. Cloud sync issue.",
        variant: "destructive"
      });
    }
  };

  const filteredFarmers = farmers.filter(f => 
    f.id !== user?.id && 
    (f.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     f.village?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="container mx-auto px-4 py-8 pt-24 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-in slide-in-from-top-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600 flex items-center gap-3">
              <Users className="text-green-500" /> {t('community.title')}
            </h1>
            <p className="text-slate-400 mt-1">{t('community.subtitle')}</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input 
                  placeholder={t('community.searchFarmers')} 
                  className="pl-9 bg-slate-900 border-slate-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="feed" className="data-[state=active]:bg-green-600">{t('community.tabs.feed')}</TabsTrigger>
            <TabsTrigger value="directory">{t('community.tabs.directory')}</TabsTrigger>
            <TabsTrigger value="messages" className="relative">
              {t('community.tabs.messages')}
              <Badge className="ml-2 bg-green-600 text-[10px]">Cloud</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="animate-in fade-in">
             <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* Featured Farmers */}
                    <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-green-500 overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500" /> {t('community.trendingNow')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                           {farmers.slice(0, 5).map(f => (
                             <div key={f.id} className="min-w-[120px] text-center">
                                <Avatar className="w-16 h-16 mx-auto border-2 border-slate-800">
                                    <AvatarImage src={f.photoUrl} />
                                    <AvatarFallback className="bg-slate-800 text-slate-400 capitalize">{f.name[0]}</AvatarFallback>
                                </Avatar>
                                <p className="text-xs mt-2 font-medium truncate text-slate-200">{f.name}</p>
                                <p className="text-[10px] text-slate-500">{f.village || 'Village'}</p>
                             </div>
                           ))}
                        </CardContent>
                    </Card>

                    {/* Community Posts (Logic should link to General Forum) */}
                    <Card className="bg-slate-900 border-slate-800 p-12 text-center">
                        <MessageSquare className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-400">{t('community.startConversation')}</h3>
                        <p className="text-slate-600 mt-2 mb-6">{t('community.joinTopics')}</p>
                        <Button className="bg-green-600" onClick={() => setActiveTab('directory')}>{t('community.findPeers')}</Button>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader><CardTitle className="text-white text-lg">{t('community.myStats')}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">{t('community.reputation')}</span>
                                <Badge className="bg-amber-900/50 text-amber-300 border-amber-800">Expert</Badge>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">{t('community.helpfulTags')}</span>
                                <span className="text-white font-medium">12</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
             </div>
          </TabsContent>

          <TabsContent value="directory" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
             {loading ? (
               <div className="col-span-full py-20 text-center text-slate-500 animate-pulse">{t('common.loading')} Cloud Directory...</div>
             ) : (
               filteredFarmers.map(f => (
                 <Card key={f.id} className="bg-slate-900 border-slate-800 hover:border-green-600/50 transition-all group">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-14 h-14 border border-slate-800">
                                <AvatarImage src={f.photoUrl} />
                                <AvatarFallback className="bg-slate-800 text-slate-400">{f.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-white group-hover:text-green-400 transition-colors">{f.name}</h3>
                                    <CheckCircle2 className="w-3 h-3 text-blue-500" />
                                </div>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                    <MapPin className="w-3 h-3" /> {f.village}, {f.address}
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-2">
                            <Button className="flex-1 bg-green-600 hover:bg-green-700 h-9 text-xs" onClick={() => { setSelectedFarmer(f); setActiveTab('messages'); }}>
                                <MessageCircle className="w-4 h-4 mr-2" /> {t('community.chat')}
                            </Button>
                            <Button variant="outline" className="border-slate-800 text-slate-400 h-9 w-10 p-0 hover:bg-slate-800">
                                <Phone className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                 </Card>
               ))
             )}
          </TabsContent>

          <TabsContent value="messages" className="animate-in slide-in-from-right-4">
            <div className="grid md:grid-cols-4 gap-6 h-[600px]">
                <Card className="bg-slate-900 border-slate-800 md:col-span-1 overflow-hidden flex flex-col">
                    <CardHeader className="bg-slate-950 p-4 border-b border-slate-800"><CardTitle className="text-sm font-bold">{t('community.recentChats')}</CardTitle></CardHeader>
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                           {farmers.slice(0, 8).map(f => (
                             <button key={f.id} onClick={() => setSelectedFarmer(f)} className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${selectedFarmer?.id === f.id ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800/50"}`}>
                                <Avatar className="w-8 h-8 border border-slate-700">
                                    <AvatarFallback className="text-[10px] bg-slate-700">{f.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs font-medium truncate">{f.name}</span>
                             </button>
                           ))}
                        </div>
                    </ScrollArea>
                </Card>

                <Card className="bg-slate-900 border-slate-800 md:col-span-3 flex flex-col relative overflow-hidden">
                    <CardHeader className="bg-slate-950 p-4 border-b border-slate-800 flex flex-row justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 border border-slate-800">
                                <AvatarImage src={selectedFarmer?.photoUrl} />
                                <AvatarFallback className="bg-slate-800 text-slate-400">{selectedFarmer?.name[0] || "?"}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-sm">{selectedFarmer?.name || t('community.selectFarmer')}</CardTitle>
                                <CardDescription className="text-[10px] text-green-500">{selectedFarmer ? 'Online' : ''}</CardDescription>
                            </div>
                        </div>
                        <Badge variant="outline" className="text-[10px] border-slate-800 text-slate-500">Live Sync</Badge>
                    </CardHeader>
                    
                    <CardContent className="flex-1 p-0 flex flex-col max-h-[calc(600px-116px)]">
                        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                           <div className="space-y-4">
                             {selectedFarmer ? (
                               messages.length === 0 ? (
                                 <div className="text-center py-20 text-slate-600 italic text-sm">{t('community.noMessages')}</div>
                               ) : (
                                 messages.map(m => (
                                   <div key={m.id} className={`flex ${m.senderId === user?.id ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2`}>
                                      <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${m.senderId === user?.id ? "bg-green-600 text-white rounded-tr-none" : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"}`}>
                                         {m.text}
                                         <div className="text-[9px] mt-1 opacity-50 text-right">{new Date(m.createdAt?.toDate?.() || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                      </div>
                                   </div>
                                 ))
                               )
                             ) : (
                               <div className="text-center py-20 text-slate-700">{t('community.selectToStart')}</div>
                             )}
                           </div>
                        </ScrollArea>

                        <div className="p-4 bg-slate-950 border-t border-slate-800">
                           <form onSubmit={handleSendMessage} className="flex gap-2">
                             <Input 
                                disabled={!selectedFarmer}
                                placeholder={t('community.typeMessage')} 
                                className="bg-slate-900 border-slate-800 text-white" 
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                             />
                             <Button type="submit" disabled={!messageText.trim() || !selectedFarmer} className="bg-green-600 hover:bg-green-700">
                                <Send className="w-4 h-4" />
                             </Button>
                           </form>
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

export default CommunityFeed;
