import { API_BASE_URL } from '@/config/api';
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import {
  MessageSquare,
  Send,
  Users,
  ThumbsUp,
  MessageCircle,
  Search,
  PlusCircle,
  Trash2,
  Image as ImageIcon,
  X,
  Volume2,
  MoreVertical,
  Reply,
  Loader2,
  Globe,
  Mic
} from "lucide-react";
import Navbar from "../components/Navbar";
import VoiceRecorder from "../components/VoiceRecorder";
import { useAuthStore } from "@/store/authStore";
import { getPosts, createPost, createComment } from "@/services/firebaseService";
import axios from "axios";

// Types
interface Comment {
  id: string;
  author: string;
  authorName?: string;
  text: string;
  createdAt: Date | { toDate: () => Date } | string;
}

interface Post {
  id: string;
  author: string;
  authorName?: string;
  avatar?: string;
  title: string;
  content: string;
  likes: number;
  comments: Comment[];
  createdAt: Date | { toDate: () => Date } | string;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  imageUrl?: string;
  audioUrl?: string;
  timestamp: string;
  recipient?: string;
  read?: boolean;
}

interface UserProfile {
  id: string;
  name?: string;
  username?: string;
  photoUrl?: string;
  city?: string;
  state?: string;
  crops?: string;
  reputation?: number;
  updatedAt?: { toDate: () => Date };
}

const Community = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuthStore();
  
  const [activeView, setActiveView] = useState<"query" | "chat">("query");
  const [posts, setPosts] = useState<Post[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeUsers, setActiveUsers] = useState<UserProfile[]>([]);
  const [trendingFarmers, setTrendingFarmers] = useState<UserProfile[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Private Chat & Notifications
  const [selectedRecipient, setSelectedRecipient] = useState<UserProfile | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const initialLoadDone = useRef(false);
  const lastMessageId = useRef<string | null>(null);
  
  // Custom notification ping using the user's provided file
  const notificationSound = useRef(new Audio("/universfield-new-notification-026-380249.mp3"));
  
  // Query Hub State
  const [showAskModal, setShowAskModal] = useState(false);
  const [queryTitle, setQueryTitle] = useState("");
  const [queryContent, setQueryContent] = useState("");
  const [isSubmittingQuery, setIsSubmittingQuery] = useState(false);
  const [replyText, setReplyText] = useState<{ [postId: string]: string }>({});

  // Chat State
  const [chatInput, setChatInput] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const API_URL = import.meta.env.VITE_API_URL || "${API_BASE_URL}";

  const handleUserSelect = async (u: UserProfile) => {
    setSelectedRecipient(u);
    const senderName = u.name || u.username || "";
    try {
      await axios.post(`${API_URL}/community/read-chat`, {
        sender: senderName,
        recipient: user?.name
      });
      setUnreadCounts(prev => ({ ...prev, [senderName]: 0 }));
    } catch(e) {
      console.error("Failed to mark chat as read");
    }
  };

  // Actions wrapped in useCallback for lint-free effects
  const fetchQueries = React.useCallback(async () => {
    try {
      const data = await getPosts();
      setPosts(data as Post[]);
    } catch (err) {
      console.error("Error fetching queries:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchGlobalChat = React.useCallback(async () => {
    try {
      let url = `${API_URL}/community/chat`;
      if (selectedRecipient && user?.name) {
         url += `?user1=${encodeURIComponent(user.name)}&user2=${encodeURIComponent(selectedRecipient.name || selectedRecipient.username || "")}`;
      }
      const res = await axios.get(url);
      
      setChatMessages((prev) => {
        // Play sound if a genuinely new message arrived
        if (initialLoadDone.current && res.data.length > 0) {
           const newMsg = res.data[res.data.length - 1];
           if (newMsg.id !== lastMessageId.current && newMsg.sender !== user?.name) {
              notificationSound.current.play().catch(e => console.log("Audio play blocked", e));
           }
        }
        if (res.data.length > 0) {
           lastMessageId.current = res.data[res.data.length - 1].id;
        } else {
           lastMessageId.current = null;
        }
        return res.data;
      });
      initialLoadDone.current = true;
      
      // Fetch notifications globally for the current user
      if (user?.name) {
         try {
           const notifRes = await axios.get(`${API_URL}/community/notifications?username=${encodeURIComponent(user.name)}`);
           const unreadArr = notifRes.data?.unread_messages || [];
           const counts: Record<string, number> = {};
           unreadArr.forEach((item: { sender: string; count: number }) => {
             counts[item.sender] = item.count;
           });
           setUnreadCounts(counts);
         } catch(e) {
           console.error("Failed to fetch notifs", e);
         }
      }
    } catch (err) {
      console.error("Chat fetch error:", err);
    }
  }, [API_URL, selectedRecipient, user?.name]);

  const fetchUsersData = React.useCallback(async () => {
    try {
      const { getFarmersList, getUserProfile, saveUserProfile } = await import("@/services/firebaseService");
      
      // Get all farmers for Trending/Active lists
      const allUsers = await getFarmersList();
      
      // Filter for active farmers (active in last 15 mins)
      const now = new Date().getTime();
      const fifteenMins = 15 * 60 * 1000;
      const active = allUsers.filter(u => {
        const lastActive = (u as UserProfile).updatedAt?.toDate?.()?.getTime() || 0;
        return (now - lastActive) < fifteenMins;
      });
      setActiveUsers(active);

      // Trending: Sort by reputation or activity (mocking score for now based on reputation field)
      const trending = [...allUsers]
        .sort((a, b) => (b.reputation || 0) - (a.reputation || 0))
        .slice(0, 5);
      setTrendingFarmers(trending);

      // Get current user's full profile for stats
      if (user?.id) {
        const profile = await getUserProfile(user.id);
        setUserProfile({ id: user.id, ...profile } as UserProfile);
        
        // Update current user's activity timestamp
        await saveUserProfile(user.id, { updatedAt: new Date() });
      }
    } catch (err) {
      console.error("Error fetching users data:", err);
    }
  }, [user?.id]);

  // Initial Fetch
  useEffect(() => {
    fetchQueries();
    fetchGlobalChat();
    fetchUsersData();
    
    const chatInterval = setInterval(fetchGlobalChat, 5000); // Poll chat
    const userInterval = setInterval(fetchUsersData, 60000); // Refresh users every min
    
    return () => {
      clearInterval(chatInterval);
      clearInterval(userInterval);
    };
  }, [fetchQueries, fetchGlobalChat, fetchUsersData]);

  const handleAskQuery = async () => {
    if (!queryTitle.trim() || !queryContent.trim() || !user) return;
    setIsSubmittingQuery(true);
    try {
      const newPost = {
        author: user.id,
        authorName: user.name || "Farmer",
        title: queryTitle,
        content: queryContent,
        createdAt: new Date(),
        likes: 0,
        comments: []
      };
      await createPost(newPost);
      setQueryTitle("");
      setQueryContent("");
      setShowAskModal(false);
      fetchQueries();
      toast({ title: t("community.postTranslated"), description: "Your query is live!" });
    } catch (err) {
      toast({ title: t("common.error"), variant: "destructive" });
    } finally {
      setIsSubmittingQuery(false);
    }
  };

  const handleReply = async (postId: string) => {
    const text = replyText[postId];
    if (!text?.trim() || !user) return;
    try {
      await createComment(postId, {
        author: user.id,
        authorName: user.name || "Farmer",
        text,
        createdAt: new Date()
      });
      setReplyText({ ...replyText, [postId]: "" });
      fetchQueries();
    } catch (err) {
      toast({ title: t("common.error"), variant: "destructive" });
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSendChat = async (voiceBlob?: Blob) => {
    if (!user && !voiceBlob) return;
    if (!chatInput.trim() && !selectedImage && !voiceBlob) return;

    setIsSendingChat(true);
    try {
      let imageUrl = "";
      let audioUrl = "";

      // Upload Image if any
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        const res = await axios.post(`${API_URL}/community/upload-image`, formData);
        imageUrl = res.data.imageUrl;
      }

      // Upload Voice if any
      if (voiceBlob) {
        const formData = new FormData();
        formData.append("audio", voiceBlob, "voice_msg.webm");
        const res = await axios.post(`${API_URL}/community/upload-audio`, formData);
        audioUrl = res.data.audioUrl;
      }

      await axios.post(`${API_URL}/community/chat`, {
        sender: user?.name || "Farmer",
        recipient: selectedRecipient ? (selectedRecipient.name || selectedRecipient.username) : null,
        text: chatInput,
        imageUrl,
        audioUrl,
        timestamp: new Date().toISOString()
      });

      setChatInput("");
      setSelectedImage(null);
      setImagePreview(null);
      fetchGlobalChat();
    } catch (err) {
      toast({ title: t("community.errorSend"), variant: "destructive" });
    } finally {
      setIsSendingChat(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b15] text-white font-sans">
      <Navbar />
      
      {/* Dynamic Header */}
      <div className="pt-24 pb-8 px-6 container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-gradient-to-r from-blue-600/10 to-green-600/10 p-8 rounded-3xl border border-white/5 backdrop-blur-xl">
          <div className="space-y-2">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1 mb-2">
              <Globe className="w-3 h-3 mr-2" /> {activeView === "chat" ? "Live Chat" : t("community.globalChat")}
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight">
              {activeView === "query" ? t("community.askQuery") : "AgriSphere Live Chat"}
            </h1>
            <p className="text-slate-400 max-w-md">
              {activeView === "query" ? t("community.querySubtitle") : "Real-time discussion with farmers across the globe."}
            </p>
          </div>
          <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/10 w-full md:w-auto">
            <Button 
              variant={activeView === "query" ? "default" : "ghost"} 
              className={`flex-1 md:w-40 rounded-xl transition-all ${activeView === "query" ? "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20" : "text-slate-400"}`}
              onClick={() => setActiveView("query")}
            >
              <MessageSquare className="w-4 h-4 mr-2" /> {t("community.tabs.feed")}
            </Button>
            <Button 
              variant={activeView === "chat" ? "default" : "ghost"}
              className={`flex-1 md:w-40 rounded-xl transition-all ${activeView === "chat" ? "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20" : "text-slate-400"}`}
              onClick={() => setActiveView("chat")}
            >
              <Users className="w-4 h-4 mr-2" /> Live Chat
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {activeView === "query" ? (
              <div className="space-y-6">
                {/* Ask Card */}
                <Card className="bg-slate-900/40 border-slate-800/50 backdrop-blur-md border-dashed border-2 hover:border-green-500/30 transition-all cursor-pointer group" onClick={() => setShowAskModal(true)}>
                  <CardContent className="py-10 flex flex-col items-center justify-center text-center">
                    <div className="bg-green-500/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <PlusCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{t("community.askBtn")}</h3>
                    <p className="text-slate-500 max-w-sm">{t("community.joinTopics")}</p>
                  </CardContent>
                </Card>

                {/* Posts Feed */}
                {loading ? (
                  <div className="flex justify-center py-20"><Loader2 className="animate-spin text-green-500 w-10 h-10" /></div>
                ) : posts.map((post) => (
                  <Card key={post.id} className="bg-slate-900/80 border-slate-800 overflow-hidden group">
                    <CardHeader className="flex flex-row items-start gap-4 pb-4">
                      <Avatar className="w-12 h-12 border-2 border-slate-800">
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback className="bg-green-600 text-white font-bold">{post.authorName?.[0] || "?"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-200">{post.authorName}</h4>
                          <span className="text-xs text-slate-500">2h ago</span>
                        </div>
                        <CardTitle className="text-xl mt-1 text-white group-hover:text-green-400 transition-colors">{post.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-300 leading-relaxed">{post.content}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                        <div className="flex gap-4">
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-green-500">
                            <ThumbsUp className="w-4 h-4 mr-2" /> {post.likes || 0}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-500">
                            <MessageSquare className="w-4 h-4 mr-2" /> {post.comments?.length || 0}
                          </Button>
                        </div>
                        <Button variant="outline" size="sm" className="border-slate-800 text-slate-400 hover:bg-slate-800">
                          <Reply className="w-4 h-4 mr-2" /> {t("community.replyBtn")}
                        </Button>
                      </div>

                      {/* Replies Area */}
                      <div className="mt-4 space-y-4 bg-black/20 p-4 rounded-2xl">
                        {post.comments?.map((comment: Comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-[10px] bg-slate-700">{comment.authorName?.[0] || "?"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 bg-slate-800/50 p-3 rounded-2xl text-sm">
                              <div className="flex justify-between mb-1">
                                <span className="font-bold text-slate-300">{comment.authorName}</span>
                              </div>
                              <p className="text-slate-400">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                        
                        <div className="flex gap-2 pt-2">
                           <Input 
                            placeholder={t("community.replyTitle")}
                            className="bg-slate-900/50 border-slate-700 text-xs" 
                            value={replyText[post.id] || ""}
                            onChange={(e) => setReplyText({ ...replyText, [post.id]: e.target.value })}
                            onKeyDown={(e) => e.key === "Enter" && handleReply(post.id)}
                           />
                           <Button size="icon" variant="ghost" onClick={() => handleReply(post.id)} className="text-green-500">
                             <Send className="w-4 h-4" />
                           </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* Global Chat Room */
              <Card className="bg-slate-900/90 border-slate-800 h-[700px] flex flex-col shadow-2xl relative">
                <CardHeader className="border-b border-slate-800 bg-black/20 px-6 py-4">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       {selectedRecipient ? (
                          <Button variant="ghost" size="icon" onClick={() => setSelectedRecipient(null)} className="h-8 w-8 text-slate-400 hover:text-white mr-2">
                            <X className="w-5 h-5" />
                          </Button>
                       ) : (
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                       )}
                       <CardTitle className="text-lg">
                         {selectedRecipient ? `Chatting with ${selectedRecipient.name || selectedRecipient.username}` : "Live Chat"}
                       </CardTitle>
                     </div>
                     <Badge variant="outline" className="text-slate-500 border-slate-800">
                       {!selectedRecipient && `${activeUsers.length} ${t("community.onlineFarmers")}`}
                       {selectedRecipient && "Private Encrypted Chat"}
                     </Badge>
                   </div>
                </CardHeader>
                
                <div className="flex flex-1 overflow-hidden">
                  <ScrollArea className="flex-1 p-6" ref={chatScrollRef}>
                    <div className="space-y-6">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === user?.name ? "flex-row-reverse" : ""}`}>
                          <Avatar className="w-10 h-10 border border-slate-800 shadow-md">
                            <AvatarImage src={msg.sender === user?.name ? userProfile?.photoUrl : ""} />
                            <AvatarFallback className={`${msg.sender === user?.name ? "bg-blue-600" : "bg-slate-700"} text-white`}>
                              {msg.sender?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`space-y-1 max-w-[75%] ${msg.sender === user?.name ? "items-end" : "items-start"}`}>
                            <div className="flex items-center gap-2 px-1">
                               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{msg.sender === user?.name ? t("community.you") : msg.sender}</span>
                               <span className="text-[9px] text-slate-600">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            
                            <div className={`p-4 rounded-3xl shadow-sm text-sm ${
                              msg.sender === user?.name 
                                ? "bg-blue-600 text-white rounded-tr-none" 
                                : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                            }`}>
                              {msg.text && <p className="leading-relaxed">{msg.text}</p>}
                              
                              {msg.imageUrl && (
                                <div className="mt-2 group relative">
                                  <img src={msg.imageUrl} alt="Shared" className="rounded-2xl max-h-60 w-full object-cover shadow-lg border border-white/5" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl cursor-pointer" onClick={() => window.open(msg.imageUrl)}>
                                    <ImageIcon className="w-6 h-6 text-white" />
                                  </div>
                                </div>
                              )}
  
                              {msg.audioUrl && (
                                <div className="mt-2 min-w-[240px] bg-black/20 p-2 rounded-2xl">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Volume2 className="w-3 h-3 text-white/50" />
                                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Voice Note</span>
                                  </div>
                                  <audio src={msg.audioUrl} controls className="h-8 w-full invert brightness-200" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Active Farmers Sidebar within Chat */}
                  <div className="hidden md:block w-64 border-l border-slate-800 bg-black/10 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Users className="w-3 h-3" /> Online Farmers
                      </h4>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {activeUsers.map((u) => {
                          const userName = u.name || u.username || "Farmer";
                          const isCurrentUser = userName === user?.name;
                          const unreadCount = unreadCounts[userName] || 0;
                          return (
                          <div 
                            key={u.id} 
                            className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${!isCurrentUser ? "group cursor-pointer hover:bg-slate-800" : ""}`} 
                            onClick={() => !isCurrentUser && handleUserSelect(u)}
                          >
                            <div className="relative">
                              <Avatar className="w-8 h-8 border border-slate-800">
                                <AvatarImage src={u.photoUrl} />
                                <AvatarFallback className={`${isCurrentUser ? "bg-blue-600" : "bg-slate-800"} text-[10px]`}>{userName[0]}</AvatarFallback>
                              </Avatar>
                              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-950" />
                              {unreadCount > 0 && !isCurrentUser && (
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-950 animate-bounce">
                                  {unreadCount}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-bold truncate transition-colors ${unreadCount > 0 ? "text-white" : (isCurrentUser ? "text-blue-400" : "text-slate-300 group-hover:text-white")}`}>
                                {userName} {isCurrentUser && <span className="text-slate-500 font-normal">(You)</span>}
                              </p>
                              <p className="text-[9px] text-slate-500 truncate">{u.city || u.state || "Farmer"}</p>
                            </div>
                          </div>
                        )})}
                      </div>
                    </ScrollArea>
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-6 bg-slate-900/50 border-t border-slate-800 backdrop-blur-xl">
                  {imagePreview && (
                    <div className="mb-4 relative inline-block animate-in zoom-in-50">
                      <img src={imagePreview} className="h-24 rounded-2xl border-2 border-blue-500 shadow-xl" />
                      <button onClick={() => { setSelectedImage(null); setImagePreview(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <input type="file" accept="image/*" className="hidden" id="chat-img" onChange={handleImageSelect} />
                      <Button size="icon" variant="outline" className="border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl" asChild>
                        <label htmlFor="chat-img" className="cursor-pointer">
                          <ImageIcon className="w-5 h-5" />
                        </label>
                      </Button>
                      <VoiceRecorder onSend={(blob) => handleSendChat(blob)} />
                    </div>

                    <div className="flex-1 relative">
                      <Input 
                        placeholder={t("community.typeMessage")}
                        className="bg-slate-950/50 border-slate-800 h-12 rounded-2xl pl-4 pr-12 focus:ring-blue-500/50 transition-all border-white/5"
                        value={chatInput}
                        onFocus={() => {
                          if (selectedRecipient) handleUserSelect(selectedRecipient);
                        }}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                      />
                      <Button 
                        size="icon" 
                        disabled={isSendingChat || (!chatInput.trim() && !selectedImage)}
                        className="absolute right-1.5 top-1.5 h-9 w-9 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg transition-transform active:scale-90"
                        onClick={() => handleSendChat()}
                      >
                        {isSendingChat ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
             <Card className="bg-slate-900/50 border-slate-800 border-l-4 border-l-green-500">
               <CardHeader><CardTitle className="text-lg">{t("community.trendingNow")}</CardTitle></CardHeader>
               <CardContent className="space-y-4">
                 {trendingFarmers.length > 0 ? trendingFarmers.map((f, i) => (
                   <div key={f.id} className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-2xl transition-colors cursor-pointer">
                     <Avatar>
                       <AvatarImage src={f.photoUrl} />
                       <AvatarFallback className="bg-slate-700">{(f.name || f.username || "?")[0]}</AvatarFallback>
                     </Avatar>
                     <div>
                       <p className="text-sm font-bold">{f.name || f.username}</p>
                       <p className="text-[10px] text-slate-500">
                         {f.crops ? `Expert in ${f.crops}` : "Experienced Farmer"} • {f.reputation || 0} Rep
                       </p>
                     </div>
                   </div>
                 )) : (
                   <p className="text-xs text-slate-500 py-4 text-center">Loading top farmers...</p>
                 )}
               </CardContent>
             </Card>

             <Card className="bg-slate-900/50 border-slate-800">
               <CardHeader><CardTitle className="text-lg">{t("community.myStats")}</CardTitle></CardHeader>
               <CardContent className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-3xl border border-white/5">
                    <p className="text-[10px] text-slate-500 mb-1">{t("community.reputation")}</p>
                    <p className="text-xl font-bold text-green-400">{userProfile?.reputation || 0}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-3xl border border-white/5">
                    <p className="text-[10px] text-slate-500 mb-1">Total Posts</p>
                    <p className="text-xl font-bold text-blue-400">{posts.filter(p => p.author === user?.id).length}</p>
                  </div>
               </CardContent>
             </Card>

             {/* Community Guidelines or AI Tip */}
             <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 p-6 rounded-3xl border border-white/10">
               <h4 className="font-bold flex items-center gap-2 mb-2 text-green-400">
                 <Globe className="w-4 h-4" /> AI Farming Tip
               </h4>
               <p className="text-xs text-slate-400 leading-relaxed italic">
                 "Our AI models suggest that global markets for Rice are rising. Check the Marketplace tab to find buyers offering premium rates today!"
               </p>
             </div>
          </div>
        </div>
      </main>

      {/* Ask Query Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-xl bg-slate-900 border-slate-800 shadow-2xl scale-in-center">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800">
              <CardTitle>{t("community.askBtn")}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowAskModal(false)}><X className="w-4 h-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Headline of your problem</label>
                <Input 
                  placeholder="e.g. My wheat leaves are turning yellow" 
                  className="bg-slate-950/50 border-slate-800"
                  value={queryTitle}
                  onChange={(e) => setQueryTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Describe it in detail</label>
                <Textarea 
                  placeholder="Tell your fellow farmers what's happening..." 
                  className="bg-slate-950/50 border-slate-800 min-h-[150px]"
                  value={queryContent}
                  onChange={(e) => setQueryContent(e.target.value)}
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" className="border-slate-800" onClick={() => setShowAskModal(false)}>Cancel</Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 w-32" 
                  onClick={handleAskQuery}
                  disabled={isSubmittingQuery || !queryTitle.trim()}
                >
                  {isSubmittingQuery ? <Loader2 className="animate-spin w-4 h-4" /> : t("community.askBtn")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Community;

