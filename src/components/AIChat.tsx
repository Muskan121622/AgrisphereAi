import { API_BASE_URL } from '@/config/api';
import { useState, useRef, useEffect } from "react";
import { speakText, stopSpeech } from "@/services/voiceService";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  X,
  Mic,
  MicOff,
  Volume2,
  Image as ImageIcon,
  X as XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "lucide-react";
import { chatWithAI } from "@/lib/openai";
import { mockChatWithAI } from "@/lib/mockAI";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import { saveAiChatMessage, getAiChatHistory } from "@/services/firebaseService";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  hindi?: string;
  imageUrl?: string;
}

const SUPPORTED_LANGUAGES = [
  { code: "en-IN", name: "English", i18nCode: "en" },
  { code: "hi-IN", name: "हिन्दी", i18nCode: "hi" },
  { code: "mr-IN", name: "मराठी", i18nCode: "mr" },
  { code: "te-IN", name: "తెలుగు", i18nCode: "te" },
  { code: "ta-IN", name: "தமிழ்", i18nCode: "ta" },
  { code: "kn-IN", name: "ಕನ್ನಡ", i18nCode: "kn" },
  { code: "bn-IN", name: "বাংলা", i18nCode: "bn" },
];

const AIChat = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const currentI18n = i18n.language || localStorage.getItem("i18nextLng") || "hi";
    const found = SUPPORTED_LANGUAGES.find(l => l.i18nCode.startsWith(currentI18n.split('-')[0]));
    return found ? found.code : "hi-IN";
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Speech handling state
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<any>(null);
  const isActuallyListening = useRef(false);

  useEffect(() => {
    const loadHistory = async () => {
        if (user && isOpen && messages.length === 0) {
            const history = await getAiChatHistory(user.id);
            if (history.length > 0) {
                setMessages(history as Message[]);
            } else {
                setMessages([{
                    id: "1",
                    text: t("aiChat.welcomeMessage"),
                    isUser: false,
                    timestamp: new Date(),
                }]);
            }
        }
    };
    loadHistory();
  }, [user, isOpen]);

  useEffect(() => {
    const currentLang = SUPPORTED_LANGUAGES.find(l => l.i18nCode === i18n.language);
    if (currentLang && currentLang.code !== selectedLanguage) {
      setSelectedLanguage(currentLang.code);
    }
  }, [i18n.language, selectedLanguage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition ||
        (window as any).SpeechRecognition;
      
      const newRecognition = new SpeechRecognition();
      newRecognition.continuous = false;
      newRecognition.interimResults = false;
      newRecognition.lang = selectedLanguage;

      newRecognition.onstart = () => {
        setIsListening(true);
        isActuallyListening.current = true;
      };

      newRecognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        isActuallyListening.current = false;
      };

      newRecognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        isActuallyListening.current = false;
        if (event.error !== 'no-speech') {
           toast({ 
             title: "Voice Error", 
             description: `Voice recognition failed: ${event.error}`,
             variant: "destructive"
           });
        }
      };

      newRecognition.onend = () => {
        setIsListening(false);
        isActuallyListening.current = false;
      };

      recognition.current = newRecognition;
    }

    return () => {
      if (recognition.current) {
        try {
          recognition.current.stop();
          isActuallyListening.current = false;
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
      stopSpeech();
    };
  }, [selectedLanguage]);

  const toggleListening = () => {
    if (!recognition.current) {
      toast({ title: "Not Supported", description: "Voice recognition is not supported in this browser." });
      return;
    }

    if (isListening || isActuallyListening.current) {
      try {
        recognition.current.stop();
        setIsListening(false);
        isActuallyListening.current = false;
      } catch (e) {
        console.error("Error stopping recognition:", e);
      }
    } else {
      try {
        recognition.current.start();
        setIsListening(true);
        isActuallyListening.current = true;
      } catch (e) {
        console.error("Error starting recognition:", e);
        // Handle InvalidStateError where it might already be started
        if (e instanceof Error && e.name === 'InvalidStateError') {
          setIsListening(true);
          isActuallyListening.current = true;
        } else {
          toast({ 
            title: "Error", 
            description: "Failed to start microphone. Please check permissions.",
            variant: "destructive"
          });
        }
      }
    }
  };

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
    if (lang) {
      i18n.changeLanguage(lang.i18nCode);
    }
  };

  const handleStopSpeech = () => {
    stopSpeech();
    setSpeakingMessageId(null);
    setIsPaused(false);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() && !selectedImage) return;
    if (isLoading) return;

    handleStopSpeech();

    try {
      let imageUrl = null;

      // Upload image first if selected (keeping local upload for storage, but persistence in history)
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        const uploadResponse = await fetch(
          "${API_BASE_URL}/community/upload-image",
          { method: "POST", body: formData }
        );

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.imageUrl;
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputText || "📷 Image",
        isUser: true,
        timestamp: new Date(),
        imageUrl: imageUrl || undefined,
      };

      setMessages((prev) => [...prev, userMessage]);
      if (user) await saveAiChatMessage(user.id, userMessage);

      setInputText("");
      setSelectedImage(null);
      setImagePreview(null);
      setIsLoading(true);

      try {
        let aiResponse: string;
        try {
          aiResponse = await chatWithAI(
            inputText || "What can you tell me about this image?",
            "general",
            selectedLanguage,
          );
        } catch (openaiError) {
          aiResponse = await mockChatWithAI(inputText || "Image analysis");
        }

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          isUser: false,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        if (user) await saveAiChatMessage(user.id, aiMessage);
      } catch (error) {
        toast({ title: t('common.error'), description: "AI response failed." });
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string, messageId: string) => {
    stopSpeech();
    setIsPaused(false);
    setSpeakingMessageId(messageId);

    speakText(text, selectedLanguage, () => {
      setSpeakingMessageId(null);
      setIsPaused(false);
    });
  };

  return (
    <>
      <motion.div className="fixed bottom-6 right-6 z-50">
        <Button onClick={() => setIsOpen(!isOpen)} className="w-16 h-16 rounded-full bg-gradient-primary shadow-lg hover:shadow-xl transition-all duration-300">
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 100, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 100, scale: 0.8 }} className="fixed bottom-24 right-6 w-96 h-[500px] z-50">
            <Card className="h-full flex flex-col bg-background/95 backdrop-blur-xl border-2 border-primary/30 shadow-2xl">
              <div className="p-4 border-b border-border/50 bg-primary/5 rounded-t-xl flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <h3 className="font-bold text-sm">{t("aiChat.title")}</h3>
                      <p className="text-[10px] text-muted-foreground">{t("aiChat.subtitle")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-[105px] h-7 text-[10px] bg-primary/10 border-primary/20 hover:bg-primary/20 transition-all font-medium">
                        <Languages className="w-3.5 h-3.5 mr-1.5 text-primary" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                         {SUPPORTED_LANGUAGES.map((lang) => (
                           <SelectItem key={lang.code} value={lang.code} className="text-xs">
                             {lang.name}
                           </SelectItem>
                         ))}
                      </SelectContent>
                    </Select>
                    <Badge variant="outline" className="text-[9px] border-primary/30 text-primary hidden md:flex">Cloud History</Badge>
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${message.isUser ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted rounded-tl-none"}`}>
                      {message.imageUrl && <img src={message.imageUrl} alt="Shared" className="rounded-lg mb-2 max-h-40 object-cover" />}
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      {!message.isUser && (
                        <div className="flex gap-2 mt-2 border-t border-border/20 pt-2">
                          <Button size="sm" variant="ghost" onClick={() => handleSpeak(message.text, message.id)} className="h-6 w-6 p-0">
                            {speakingMessageId === message.id ? "⏸️" : <Volume2 className="w-4 h-4" />}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && <div className="bg-muted p-3 rounded-lg w-fit animate-pulse text-xs">AI is typing...</div>}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border/50 bg-background/50">
                <div className="flex gap-2">
                  <Input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Ask anything..." onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} />
                  <Button 
                    size="sm" 
                    variant={isListening ? "destructive" : "outline"} 
                    onClick={toggleListening} 
                    className={`shrink-0 ${isListening ? "animate-pulse bg-red-500 hover:bg-red-600 border-none shadow-lg shadow-red-500/50" : "hover:bg-primary/10 border-primary/20"}`}
                  >
                    {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-primary" />}
                  </Button>
                  <Button size="sm" onClick={handleSendMessage} disabled={isLoading || (!inputText.trim() && !selectedImage)}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;

