
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, Send, Users, ThumbsUp, MessageCircle, Search, User, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNotificationStore } from "@/store/notificationStore";
import { useAuthStore } from "@/store/authStore";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Mic, MicOff, Volume2, StopCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { translateText } from "@/lib/ai-translation";

interface Post {
    id: string;
    author: string;
    avatar?: string;
    title: string;
    content: string;
    tags: string[];
    likes: number;
    comments: {
        id: string;
        author: string;
        text: string;
        timestamp: string;
    }[];
    timestamp: string;
}

interface ChatMessage {
    id: string;
    sender: string;
    text: string;
    imageUrl?: string;
    timestamp: string;
}

interface UserProfile {
    username: string;
    photoUrl: string;
}

// Helper for Date Grouping
const formatDateLabel = (isoDate: string, t: any) => {
    const date = new Date(isoDate);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return t('common.today') || "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
        return t('common.yesterday') || "Yesterday";
    } else {
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    }
};

const Community = () => {
    const { t, i18n } = useTranslation();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("forum");
    const [posts, setPosts] = useState<Post[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Forum Inputs
    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostContent, setNewPostContent] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");

    // Chat Inputs
    const [chatInput, setChatInput] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { user } = useAuthStore();
    const [username, setUsername] = useState(() => {
        const userEmail = user?.email || "default";
        
        // Try user specific profile name first
        const specificStored = localStorage.getItem(`profile_${userEmail}_username`);
        if (specificStored) {
            localStorage.setItem("agrisphere_username", specificStored);
            return specificStored;
        }

        // Try the auth store name if no profile
        if (user?.name) {
            localStorage.setItem("agrisphere_username", user.name);
            return user.name;
        }

        const stored = localStorage.getItem("agrisphere_username");
        if (stored) return stored;

        const newRandom = `Farmer_${Math.floor(Math.random() * 1000)}`;
        localStorage.setItem("agrisphere_username", newRandom);
        return newRandom;
    });
    // Updated to store objects instead of simple strings
    const [onlineUsers, setOnlineUsers] = useState<{ username: string, photoUrl?: string }[]>([]);
    const [activePrivateChat, setActivePrivateChat] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<{ [key: string]: number }>({}); // sender -> count
    const notificationsRef = React.useRef<{ [key: string]: number }>({});

    // Keep ref in sync for interval
    useEffect(() => {
        notificationsRef.current = notifications;
    }, [notifications]);

    // Voice Hooks
    const voiceTitle = useVoiceInput();
    const voiceContent = useVoiceInput();
    const voiceChat = useVoiceInput();
    const tts = useTextToSpeech();

    // Sync Voice Input to State
    useEffect(() => {
        if (voiceTitle.transcript) setNewPostTitle(prev => prev + (prev ? " " : "") + voiceTitle.transcript);
    }, [voiceTitle.transcript]);

    useEffect(() => {
        if (voiceContent.transcript) setNewPostContent(prev => prev + (prev ? " " : "") + voiceContent.transcript);
    }, [voiceContent.transcript]);

    useEffect(() => {
        if (voiceChat.transcript) setChatInput(prev => prev + (prev ? " " : "") + voiceChat.transcript);
    }, [voiceChat.transcript]);

    const API_URL = 'http://localhost:5000';

    // Effects moved to bottom


    const fetchOnlineUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/community/online`);
            // Backend now returns [{username, photoUrl}]
            setOnlineUsers(res.data);
        } catch (e) {
            console.error("Error fetching online users", e);
        }
    };

    // Merged component logic
    const { addNotification } = useNotificationStore();
    // ... existing state ...

    const isFirstLoad = React.useRef(true);

    // ... existing fetchNotifications ...
    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`${API_URL}/community/notifications?username=${username}`);
            const unreadData = res.data.unread_messages;
            const newNotifs: { [key: string]: number } = {};
            let shouldPlayGlobalSound = false;
            let totalUnreadOnLoad = 0;

            unreadData.forEach((item: any) => {
                newNotifs[item.sender] = item.count;

                // Show toast if count increased and NOT currently chatting with them
                // Use ref to get latest state inside interval
                const prevCount = notificationsRef.current[item.sender] || 0;

                if (isFirstLoad.current && item.count > 0 && activePrivateChat !== item.sender) {
                    shouldPlayGlobalSound = true;
                    totalUnreadOnLoad += item.count;
                }

                // Skip alert on first load to prevent sound explosion, or play once
                if (!isFirstLoad.current && item.count > prevCount && activePrivateChat !== item.sender) {
                    // Play notification sound
                    try {
                        const audio = new Audio("https://cdn.freesound.org/previews/536/536108_2738741-lq.mp3"); // Simple ping sound
                        audio.play().catch(e => console.log("Audio play failed (interaction needed first)", e));
                    } catch (e) {
                        console.error("Audio error", e);
                    }

                    // Global Notification
                    addNotification({
                        type: 'community',
                        title: `Message from ${item.sender}`,
                        message: `You have ${item.count} unread messages.`,
                        actionUrl: '/community'
                    });

                    toast({
                        title: "New Message",
                        description: `Message from ${item.sender}`,
                        // Action to switch chat
                        action: <Button variant="outline" size="sm" onClick={() => setActivePrivateChat(item.sender)}>View</Button>
                    });
                }
            });

            if (isFirstLoad.current && shouldPlayGlobalSound) {
                try {
                    const audio = new Audio("https://cdn.freesound.org/previews/536/536108_2738741-lq.mp3");
                    audio.play().catch(e => console.log("Audio play failed on load", e));
                } catch(e) {}
                toast({
                    title: "Unread Messages",
                    description: `You have ${totalUnreadOnLoad} unread messages marked on the user list.`
                });
            }

            setNotifications(newNotifs);
            isFirstLoad.current = false; // Mark first load as done
        } catch (error) {
            console.error("Error fetching notifications", error);
        }
    };

    const fetchPosts = async () => {
        try {
            const res = await axios.get(`${API_URL}/community/posts`);
            setPosts(res.data);
            setError("");
        } catch (error) {
            console.error("Error fetching posts:", error);
            setError("Failed to load posts. Is the server running?");
        } finally {
            setLoading(false);
        }
    };

    const fetchChat = async () => {
        try {
            let url = `${API_URL}/community/chat`;
            const params: any = {};
            if (activePrivateChat) {
                params.user1 = username;
                params.user2 = activePrivateChat;
            }

            const res = await axios.get(url, { params });
            const newMessages = res.data;

            // Avoid unnecessary re-renders
            // Note: In a real app we'd compare IDs or last timestamp
            setChatMessages(newMessages);

            // Update notifications if logic existed for it (simplified here)
        } catch (error) {
            console.error("Error fetching chat:", error);
        }
    };

    const handleDeleteMessage = async (msgId: string) => {
        try {
            await axios.delete(`${API_URL}/community/chat/${msgId}`, {
                params: { username }
            });
            // Optimistic update
            setChatMessages(prev => prev.filter(msg => msg.id !== msgId));
            toast({ title: "Deleted", description: "Message removed." });
        } catch (error) {
            console.error("Failed to delete message", error);
            toast({ title: "Error", description: "Could not delete message.", variant: "destructive" });
        }
    };

    const handlePostReply = async (postId: string) => {
        if (!replyText.trim()) return;

        try {
            await axios.post(`${API_URL}/community/posts/${postId}/comments`, {
                author: username,
                text: replyText
            });
            setReplyText("");
            toast({ title: "Success", description: "Reply added!" });
            fetchPosts(); // Refresh to show new comment
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to add reply", variant: "destructive" });
        }
    };

    const handleCreatePost = async () => {
        if (!newPostTitle.trim() || !newPostContent.trim()) {
            toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
            return;
        }

        setIsPosting(true);
        try {
            const newPost = {
                author: username, // In a real app, use auth user
                title: newPostTitle,
                content: newPostContent,
                tags: ["General"],
            };

            await axios.post(`${API_URL}/community/posts`, newPost);

            setNewPostTitle("");
            setNewPostContent("");
            toast({ title: "Success", description: "Question posted to the forum!" });
            fetchPosts();
        } catch (error) {
            toast({ title: t('common.error'), description: t('community.errorPost'), variant: "destructive" });
        } finally {
            setIsPosting(false);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim() && !selectedImage) return;

        try {
            let imageUrl = null;

            // Upload image first if selected
            if (selectedImage) {
                const formData = new FormData();
                formData.append('image', selectedImage);

                const uploadResponse = await axios.post(`${API_URL}/community/upload-image`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                imageUrl = uploadResponse.data.imageUrl;
            }

            const msg: any = {
                sender: username,
                text: chatInput || "📷 Image"
            };

            if (imageUrl) {
                msg.imageUrl = imageUrl;
            }

            if (activePrivateChat) {
                msg.recipient = activePrivateChat;
            }

            await axios.post(`${API_URL}/community/chat`, msg);
            setChatInput("");
            setSelectedImage(null);
            setImagePreview(null);
            fetchChat();
        } catch (error) {
            console.error("Failed to send message", error);
            toast({ title: t('common.error'), description: t('community.errorSend'), variant: "destructive" });
        }
    };

    const handleTranslate = async (msgId: string, text: string) => {
        const langMap: Record<string, string> = {
            'en': 'English', 'hi': 'Hindi', 'bn': 'Bengali', 'as': 'Assamese', 'kn': 'Kannada'
        };
        const targetLang = langMap[i18n.language] || 'Hindi'; // fallback to Hindi if they are in English and click translate

        try {
            const translatedText = await translateText(text, targetLang);
            
            setChatMessages(prev => prev.map(msg =>
                msg.id === msgId
                    ? { ...msg, text: msg.text.includes(" (TR)") ? msg.text.split(" (TR)")[0] : `${msg.text} (TR): ${translatedText}` }
                    : msg
            ));
            toast({ title: t('common.success'), description: t('community.translatedLocally') });
        } catch(e) {
            toast({ title: t('common.error'), description: "Translation failed" });
        }
    };

    const handleTranslatePost = async (postId: string, title: string, content: string) => {
        const langMap: Record<string, string> = {
            'en': 'English', 'hi': 'Hindi', 'bn': 'Bengali', 'as': 'Assamese', 'kn': 'Kannada'
        };
        const targetLang = langMap[i18n.language] || 'Hindi'; 

        try {
            toast({ title: t('community.translatingToast'), description: t('community.aiTranslating') });
            const translatedTitle = await translateText(title, targetLang);
            const translatedContent = await translateText(content, targetLang);
            
            setPosts(prev => prev.map(post =>
                post.id === postId
                    ? { ...post, title: translatedTitle, content: translatedContent }
                    : post
            ));
            toast({ title: t('common.success'), description: "Post translated successfully" });
        } catch(e) {
            toast({ title: t('common.error'), description: "Failed to translate post" });
        }
    };

    useEffect(() => {
        fetchPosts();
        const interval = setInterval(fetchPosts, 10000); // Polling for updates
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (activeTab === 'chat') {
            fetchChat();
            fetchOnlineUsers();
            fetchNotifications();

            const interval = setInterval(() => {
                fetchChat();
                fetchOnlineUsers();
                fetchNotifications();
            }, 3000); // Faster polling for chat

            // Heartbeat
            const heartbeat = setInterval(() => {
                axios.post(`${API_URL}/community/heartbeat`, { username });
            }, 10000);

            // Initial heartbeat
            axios.post(`${API_URL}/community/heartbeat`, { username });

            return () => {
                clearInterval(interval);
                clearInterval(heartbeat);
            };
        }
    }, [activeTab, username, activePrivateChat]);

    return (
        <div className="min-h-screen bg-black/95 text-white">
            <Navbar />

            <main className="container mx-auto px-4 py-8 pt-24">
                {/* ... existing header ... */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                            {t('community.title')}
                        </h1>
                        <p className="text-slate-400 mt-2">{t('community.subtitle')}</p>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-slate-900 border border-slate-800 p-1">
                        <TabsTrigger value="forum" className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-slate-400">
                            <MessageSquare className="w-4 h-4 mr-2" /> {t('community.tabs.feed')}
                        </TabsTrigger>
                        <TabsTrigger value="chat" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400">
                            <MessageCircle className="w-4 h-4 mr-2" /> {t('community.tabs.experts')}
                        </TabsTrigger>
                    </TabsList>

                    {/* FORUM TAB CONTENT (unchanged) */}
                    <TabsContent value="forum" className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Post List */}
                            <div className="md:col-span-2 space-y-4">
                                <div className="flex gap-4 mb-6">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                        <Input placeholder={t('community.searchPlaceholder')} className="pl-10 bg-slate-900 border-slate-800 text-white" />
                                    </div>
                                    <Button variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-800">{t('advisoryHub.filter')}</Button>
                                </div>

                                {loading ? (
                                    <div className="text-center py-12 text-slate-500">{t('community.loadingDiscussions')}</div>
                                ) : error ? (
                                    <div className="text-center py-12 text-red-400 border border-red-900/50 rounded-lg bg-red-900/20">
                                        {error}
                                        <Button variant="link" className="text-red-300 block mx-auto mt-2" onClick={fetchPosts}>{t('common.tryAgain')}</Button>
                                    </div>
                                ) : posts.length === 0 ? (
                                    <div className="text-center py-12 border border-dashed border-slate-800 rounded-lg">
                                        <p className="text-slate-500">{t('community.noDiscussions')}</p>
                                    </div>
                                ) : (
                                    posts.map((post) => (
                                        <Card key={post.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all cursor-pointer group">
                                            <CardContent className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <Avatar className="h-10 w-10 border border-slate-700">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} />
                                                        <AvatarFallback><User /></AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start" onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}>
                                                            <div>
                                                                <h3 className="font-semibold text-lg text-white group-hover:text-green-400 transition-colors">{post.title}</h3>
                                                                <p className="text-sm text-slate-400 mt-1 line-clamp-2">{post.content}</p>
                                                            </div>
                                                            <Badge variant="outline" className="border-slate-700 text-slate-400">{post.tags[0]}</Badge>
                                                        </div>

                                                        <div className="flex items-center gap-6 mt-4 text-sm text-slate-500">
                                                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                                                            <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {post.likes} Likes</span>
                                                            <button
                                                                className="flex items-center gap-1 hover:text-green-400 transition-colors"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setExpandedPostId(expandedPostId === post.id ? null : post.id);
                                                                }}
                                                            >
                                                                <MessageSquare className="w-3 h-3" /> {post.comments?.length || 0} Replies
                                                            </button>
                                                            <span>{formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}</span>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 w-6 p-0 hover:bg-slate-800 rounded-full text-slate-400 hover:text-green-400"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleTranslatePost(post.id, post.title, post.content);
                                                                }}
                                                                title={t('community.translatePost')}
                                                            >
                                                                <div className="w-4 h-4 flex items-center justify-center text-[10px] font-bold">অ</div>
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 w-6 p-0 hover:bg-slate-800 rounded-full text-slate-400 hover:text-green-400"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    tts.speak(`${post.title}. ${post.content}`);
                                                                }}
                                                            >
                                                                <Volume2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>

                                                        {/* Expanded Comments Section */}
                                                        {expandedPostId === post.id && (
                                                            <div className="mt-6 pt-4 border-t border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                                                                <h4 className="text-sm font-semibold text-slate-300 mb-4">{t('community.replies')}</h4>
                                                                <div className="space-y-4 mb-4">
                                                                    {post.comments && post.comments.length > 0 ? (
                                                                        post.comments.map((comment, idx) => (
                                                                            <div key={idx} className="bg-slate-800/50 rounded-lg p-3">
                                                                                <div className="flex justify-between items-center mb-1">
                                                                                    <span className="text-xs font-semibold text-green-400">{comment.author}</span>
                                                                                    <span className="text-xs text-slate-500">{formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}</span>
                                                                                </div>
                                                                                <p className="text-sm text-slate-200">{comment.text}</p>
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        <p className="text-sm text-slate-500 italic">{t('community.noReplies')}</p>
                                                                    )}
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Input
                                                                        placeholder={t('community.replyTitle')}
                                                                        className="bg-slate-800 border-slate-700 h-9 text-sm"
                                                                        value={replyText}
                                                                        onChange={(e) => setReplyText(e.target.value)}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter') {
                                                                                e.stopPropagation();
                                                                                handlePostReply(post.id);
                                                                            }
                                                                        }}
                                                                    />
                                                                    <Button
                                                                        size="sm"
                                                                        className="bg-green-600 hover:bg-green-700 h-9"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handlePostReply(post.id);
                                                                        }}
                                                                    >
                                                                        {t('community.replyBtn')}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>

                            {/* Ask Question Sidebar */}
                            <div className="md:col-span-1">
                                <Card className="bg-slate-900 border-slate-800 sticky top-24">
                                    <CardHeader>
                                        <CardTitle className="text-white">{t('community.askBtn')}</CardTitle>
                                        <CardDescription className="text-slate-400">{t('community.subtitle')}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <label className="text-sm text-slate-300">{t('marketplace.sell.title')}</label>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={`h-6 w-6 p-0 ${voiceTitle.isListening ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}
                                                    onClick={voiceTitle.isListening ? voiceTitle.stopListening : voiceTitle.startListening}
                                                >
                                                    {voiceTitle.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                            <Input
                                                placeholder={t('marketplace.sell.titlePlaceholder')}
                                                className="bg-black/50 border-slate-700 text-white"
                                                value={newPostTitle}
                                                onChange={(e) => setNewPostTitle(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <label className="text-sm text-slate-300">{t('marketplace.sell.description')}</label>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={`h-6 w-6 p-0 ${voiceContent.isListening ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}
                                                    onClick={voiceContent.isListening ? voiceContent.stopListening : voiceContent.startListening}
                                                >
                                                    {voiceContent.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                            <Textarea
                                                placeholder={t('marketplace.sell.descPlaceholder')}
                                                className="bg-black/50 border-slate-700 text-white min-h-[120px]"
                                                value={newPostContent}
                                                onChange={(e) => setNewPostContent(e.target.value)}
                                            />
                                        </div>
                                        <Button
                                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                                            onClick={handleCreatePost}
                                            disabled={isPosting}
                                        >
                                            {isPosting ? t('community.askBtn') : t('community.askBtn')}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* LIVE CHAT TAB */}
                    <TabsContent value="chat" className="h-[600px] flex gap-4">
                        <Card className="flex-1 bg-slate-900 border-slate-800 flex flex-col">
                            {/* Chat Header */}
                            <CardHeader className="border-b border-slate-800 pb-4 bg-slate-900/50">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="flex items-center gap-2 text-white">
                                        <div className={`w-2 h-2 rounded-full ${activePrivateChat ? 'bg-blue-500' : 'bg-green-500'} animate-pulse`}></div>
                                        {activePrivateChat ? `${t('community.chatWith')} ${activePrivateChat}` : t('community.globalChat')}
                                    </CardTitle>
                                    {activePrivateChat && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-slate-400 hover:text-white hover:bg-slate-800"
                                            onClick={() => setActivePrivateChat(null)}
                                        >
                                            {t('community.tabs.feed')}
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <ScrollArea className="flex-1 p-4 bg-black/20">
                                <div className="space-y-4">
                                    {(activePrivateChat && chatMessages.length === 0) ? (
                                        <div className="text-center text-slate-500 mt-20">
                                            {t('common.clickToChat')}
                                        </div>
                                    ) : (
                                        chatMessages.map((msg, i) => {
                                            const showDate = i === 0 || formatDateLabel(msg.timestamp, t) !== formatDateLabel(chatMessages[i - 1].timestamp, t);

                                            return (
                                                <div key={msg.id || i}>
                                                    {showDate && (
                                                        <div className="flex justify-center my-4">
                                                            <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                                                                {formatDateLabel(msg.timestamp, t)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className={`flex gap-3 mb-4 ${msg.sender === username ? 'flex-row-reverse' : 'flex-row'}`}>
                                                        <Avatar className="h-8 w-8 border border-white/10">
                                                            <AvatarFallback className={`text-white ${msg.sender === username ? 'bg-blue-600' : 'bg-slate-700'}`}>
                                                                {msg.sender[0]}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className={`rounded-2xl p-3 max-w-[80%] group relative transition-all ${msg.sender === username
                                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                                            : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                                                            }`}>
                                                            <div className="text-xs opacity-70 mb-1 flex justify-between gap-4">
                                                                <span>{msg.sender === username ? t('community.you') : msg.sender}</span>
                                                                <div className="flex items-center gap-2">
                                                                    <span>{new Date(msg.timestamp).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}</span>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-4 w-4 p-0 opacity-50 hover:opacity-100"
                                                                        onClick={() => tts.speak(msg.text)}
                                                                    >
                                                                        <Volume2 className="w-3 h-3" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            {msg.text && <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>}
                                                            {msg.imageUrl && (
                                                                <div className="mt-2">
                                                                    <img
                                                                        src={msg.imageUrl}
                                                                        alt="Shared image"
                                                                        className="rounded-lg max-w-full max-h-64 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                                                                        onClick={() => window.open(msg.imageUrl, '_blank')}
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* Actions Group */}
                                                            <div className={`absolute top-2 flex gap-1 transition-opacity opacity-0 group-hover:opacity-100 ${msg.sender === username ? '-left-16' : '-right-16'}`}>
                                                                {/* Translate Button (For others' messages) */}
                                                                {msg.sender !== username && (
                                                                    <button
                                                                        onClick={() => handleTranslate(msg.id, msg.text)}
                                                                        className="p-1.5 bg-slate-800 border border-slate-700 rounded-full text-slate-400 hover:text-white shadow-lg"
                                                                        title="Translate to Hindi"
                                                                    >
                                                                        <div className="w-4 h-4 flex items-center justify-center text-[10px] font-bold">अ</div>
                                                                    </button>
                                                                )}

                                                                {/* Delete Button (For own messages) */}
                                                                {msg.sender === username && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            if (confirm(t('community.deleteMessageConfirm'))) handleDeleteMessage(msg.id);
                                                                        }}
                                                                        className="p-1.5 bg-slate-800 border border-red-500/30 rounded-full text-red-400 hover:bg-red-500 hover:text-white shadow-lg transition-colors"
                                                                        title={t('community.deleteMessage')}
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </ScrollArea>
                            {/* Chat Input */}
                            <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="mb-3 relative inline-block">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-h-32 rounded-lg border-2 border-green-500/50"
                                        />
                                        <button
                                            onClick={handleRemoveImage}
                                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="hidden"
                                        id="chat-image-upload"
                                    />
                                    <label htmlFor="chat-image-upload">
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            className="border-slate-700 hover:bg-slate-800 cursor-pointer"
                                            asChild
                                        >
                                            <div>
                                                <ImageIcon className="w-4 h-4" />
                                            </div>
                                        </Button>
                                    </label>
                                    <Input
                                        placeholder={activePrivateChat ? `${t('community.searchPlaceholder')} ${activePrivateChat}...` : t('community.searchPlaceholder')}
                                        className="bg-black/50 border-slate-700 text-white focus:ring-blue-500/50"
                                        value={chatInput}
                                        onChange={(e) => setChatInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className={`border-slate-700 hover:bg-slate-800 ${voiceChat.isListening ? 'text-red-500 animate-pulse border-red-500' : ''}`}
                                        onClick={voiceChat.isListening ? voiceChat.stopListening : voiceChat.startListening}
                                    >
                                        {voiceChat.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                    </Button>
                                    <Button size="icon" className={`${activePrivateChat ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} transition-colors`} onClick={handleSendMessage}>
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                        {/* Sidebar: Online Users */}
                        <Card className="w-64 bg-slate-900 border-slate-800 hidden md:flex flex-col">
                            <CardHeader className="border-b border-slate-800/50 pb-3">
                                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Users className="w-3 h-3" /> {t('community.onlineFarmers')} ({onlineUsers.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 p-2">
                                <ScrollArea className="h-[480px]">
                                    <div className="space-y-1">
                                        {onlineUsers.map((user, i) => (
                                            <div
                                                key={i}
                                                onClick={() => user.username !== username && setActivePrivateChat(user.username)}
                                                className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${user.username === username ? 'opacity-50 cursor-default' :
                                                    activePrivateChat === user.username ? 'bg-blue-600/20 border border-blue-600/50' : 'hover:bg-slate-800'
                                                    }`}
                                            >
                                                <div className="relative">
                                                    <Avatar className="h-8 w-8 border border-white/10">
                                                        <AvatarImage src={user.photoUrl} />
                                                        <AvatarFallback className="bg-slate-700 text-slate-300 font-medium">{user.username[0]}</AvatarFallback>
                                                    </Avatar>

                                                    {/* Notification Badge */}
                                                    {notifications[user.username] > 0 && user.username !== activePrivateChat && (
                                                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10 animate-bounce">
                                                            {notifications[user.username] > 9 ? '9+' : notifications[user.username]}
                                                        </div>
                                                    )}

                                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-medium ${activePrivateChat === user.username ? 'text-blue-400' : 'text-slate-300'}`}>
                                                        {user.username} {user.username === username && `(${t('community.you')})`}
                                                    </span>
                                                    {user.username !== username && (
                                                        <span className="text-[10px] text-slate-500">
                                                            {notifications[user.username] > 0 && user.username !== activePrivateChat ?
                                                                <span className="text-red-400 font-semibold">{notifications[user.username]} {t('common.messages')}</span>
                                                                : t('common.clickToChat')
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

export default Community;
