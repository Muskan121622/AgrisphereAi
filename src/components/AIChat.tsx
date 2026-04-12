import { useState, useRef, useEffect } from 'react';
import { speakText, stopSpeech } from '@/services/voiceService';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Mic, MicOff, Volume2, Image as ImageIcon, X as XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { chatWithAI, translateToHindi } from '@/lib/openai';
import { mockChatWithAI } from '@/lib/mockAI';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  hindi?: string;
  imageUrl?: string;
}

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am AgriSphere AI. Select your language to start chatting.\nनमस्ते! मैं AgriSphere AI हूं। बात करने के लिए अपनी भाषा चुनें।',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Speech handling state
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = selectedLanguage; // Dynamic language listening

      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);

        // Stop recognition to prevent continuous listening
        if (recognition.current) {
          recognition.current.stop();
        }
      };

      recognition.current.onerror = () => {
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }

    // Cleanup speech synthesis on unmount
    return () => {
      stopSpeech();
    };
  }, []);

  const handleStopSpeech = () => {
    stopSpeech();
    setSpeakingMessageId(null);
    setIsPaused(false);
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
    if (!inputText.trim() && !selectedImage) return;
    if (isLoading) return;

    // Stop logic if we are speaking
    handleStopSpeech();

    try {
      let imageUrl = null;

      // Upload image first if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);

        const uploadResponse = await fetch('http://localhost:5000/community/upload-image', {
          method: 'POST',
          body: formData
        });

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.imageUrl;
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputText || "📷 Image",
        isUser: true,
        timestamp: new Date(),
        imageUrl: imageUrl || undefined
      };

      setMessages(prev => [...prev, userMessage]);
      setInputText('');
      setSelectedImage(null);
      setImagePreview(null);
      setIsLoading(true);

      try {
        // Try OpenAI/Groq first, fallback to mock if it fails
        let aiResponse: string;
        let hindiTranslation = '';

        try {
          // Pass selected language to get response in that language directly
          aiResponse = await chatWithAI(inputText || "What can you tell me about this image?", 'general', selectedLanguage);
        } catch (openaiError) {
          console.log('OpenAI failed, using mock AI:', openaiError);
          aiResponse = await mockChatWithAI(inputText || "What can you tell me about this image?");
        }

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          // No separate 'hindi' property needed as 'text' is already in target language
          isUser: false,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Sorry, I encountered an error. Please try again / क्षमा करें, त्रुटि हुई।',
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (recognition.current && !isListening) {
      handleStopSpeech(); // Stop AI speaking when user starts speaking

      setIsListening(true);
      try {
        recognition.current.start();
      } catch (error) {
        console.error('Speech recognition start error:', error);
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognition.current && isListening) {
      try {
        recognition.current.stop();
      } catch (error) {
        console.error('Speech recognition stop error:', error);
      }
      setIsListening(false);
    }
  };

  const handleSpeak = (text: string, messageId: string) => {
    // New speech - cancel any ongoing
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
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full bg-gradient-primary shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] z-50"
          >
            <Card className="h-full flex flex-col bg-background/95 backdrop-blur-xl border-2 border-primary/30">
              {/* Header */}
              <div className="p-4 border-b border-border/50 bg-gradient-primary/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🤖</span>
                    <div>
                      <h3 className="font-bold">AgriSphere AI</h3>
                      <p className="text-xs text-muted-foreground">Agricultural Assistant</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="px-2 py-1 text-xs rounded border border-border bg-background"
                    >
                      <option value="en-IN">English (India)</option>
                      <option value="hi-IN">Hindi (हिंदी)</option>
                      <option value="as-IN">Assamese (অসমীয়া)</option>
                      <option value="bn-IN">Bengali (Bangla)</option>
                      <option value="brx-IN">Bodo</option>
                      <option value="mni-IN">Manipuri (Meitei)</option>
                      <option value="kok-IN">Kokborok</option>
                      <option value="lus-IN">Mizo</option>
                      <option value="ne-IN">Nepali</option>
                      <option value="kh-IN">Khasi</option>
                      <option value="grt-IN">Garo</option>
                      <option value="nj-IN">Nagamese</option>
                      <option value="ao-IN">Ao Naga</option>
                      <option value="ang-IN">Angami Naga</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-lg ${message.isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                        }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                      {message.imageUrl && (
                        <div className="mt-2">
                          <img
                            src={message.imageUrl}
                            alt="Shared image"
                            className="rounded-lg max-w-full max-h-48 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(message.imageUrl, '_blank')}
                          />
                        </div>
                      )}
                      {!message.isUser && (
                        <div className="flex gap-2 mt-2 border-t border-gray-200/20 pt-2 items-center">
                          {/* Play/Pause Button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleSpeak(message.text, message.id)}
                            className={`h-6 w-6 p-0 hover:bg-black/10 rounded-full ${speakingMessageId === message.id ? 'text-primary' : ''}`}
                            title={speakingMessageId === message.id && !isPaused ? "Pause" : "Listen in Hindi"}
                          >
                            {speakingMessageId === message.id && !isPaused ? (
                              <span className="text-xs font-bold">⏸️</span>
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </Button>

                          {/* Stop Button (only visible when speaking this message) */}
                          {speakingMessageId === message.id && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleStopSpeech}
                              className="h-6 w-6 p-0 hover:bg-red-100 text-red-500 rounded-full"
                              title="Stop Speaking"
                            >
                              <span className="text-xs font-bold">⏹️</span>
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border/50">
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-3 relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-24 rounded-lg border-2 border-primary/50"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="ai-chat-image-upload"
                  />
                  <label htmlFor="ai-chat-image-upload">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                      asChild
                    >
                      <div>
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    </Button>
                  </label>
                  <Input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={selectedLanguage === 'en-IN' ? "Ask your question..." : "Ask in your language..."}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isLoading}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={isListening ? stopListening : startListening}
                    className={`transition-all duration-300 ${isListening ? 'bg-red-500 text-white animate-pulse' : ''
                      }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={(!inputText.trim() && !selectedImage) || isLoading}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {selectedLanguage === 'en-IN' ? "Speak or type in English" : "Speak or type in your language"}
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;