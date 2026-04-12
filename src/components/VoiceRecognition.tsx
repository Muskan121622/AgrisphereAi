import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { chatWithAI, translateToHindi } from '@/lib/openai';
import { mockChatWithAI } from '@/lib/mockAI';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { speakText, stopSpeech } from '@/services/voiceService';
import { useDialect } from '@/lib/use-dialect';

const VoiceRecognition = () => {
  const { t, i18n } = useTranslation();
  const { dialect } = useDialect();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [hindiResponse, setHindiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('hi-IN');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognition = useRef<any>(null);
  const utteranceRef = useRef<any>(null);

  const languages = [
    { code: 'hi-IN', name: 'Hindi (हिंदी)', flag: '🇮🇳' },
    { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },

    // Northeast Official Languages
    { code: 'as-IN', name: 'Assamese (অसमীয়া)', flag: 'AS' },
    { code: 'bn-IN', name: 'Bengali (Bangla)', flag: 'TR' },
    { code: 'brx-IN', name: 'Bodo', flag: 'AS' },
    { code: 'mni-IN', name: 'Meitei (Manipuri)', flag: 'MN' },
    { code: 'kok-IN', name: 'Kokborok (Tripuri)', flag: 'TR' },
    { code: 'lus-IN', name: 'Mizo', flag: 'MZ' },
    { code: 'ne-IN', name: 'Nepali', flag: 'SK' },

    // Tribal & Regional Languages
    { code: 'kh-IN', name: 'Khasi', flag: 'ML' },
    { code: 'grt-IN', name: 'Garo', flag: 'ML' },
    { code: 'nj-IN', name: 'Nagamese', flag: 'NL' },
    { code: 'ao-IN', name: 'Ao Naga', flag: 'NL' },
    { code: 'ang-IN', name: 'Angami Naga', flag: 'NL' },
  ];

  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      // Use Hindi or English as fallback acoustic model for tribal languages
      recognition.current.lang = ['hi-IN', 'en-IN', 'bn-IN'].includes(selectedLanguage) ? selectedLanguage : 'en-IN';

      recognition.current.onresult = async (event: any) => {
        const spokenText = event.results[0][0].transcript;
        setTranscript(spokenText);
        setIsListening(false);
        setIsProcessing(true);

        // Stop recognition to prevent continuous listening
        if (recognition.current) {
          recognition.current.stop();
        }

        try {
          // Find full language name for better AI context
          const langObj = languages.find(l => l.code === selectedLanguage);
          const languageName = langObj ? langObj.name : selectedLanguage;

          // Use improved voice assistant backend
          const response = await fetch('http://localhost:5000/voice-query', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: spokenText,
              language: languageName, // Send full name for AI context
              dialect: dialect        // Send current dialect
            })
          });

          let aiResponse = '';
          let hindiTranslation = '';

          if (response.ok) {
            const data = await response.json();
            aiResponse = data.response.text;
            hindiTranslation = data.response.audio_text;
          } else {
            // Fallback to mock AI
            aiResponse = await mockChatWithAI(spokenText);
            hindiTranslation = aiResponse;
          }

          setResponse(aiResponse);
          setHindiResponse(hindiTranslation);

          // Speak the response
          speakResponse(hindiTranslation); // Speak the audio_text version
        } catch (error) {
          console.error('Voice processing error:', error);
          /* Added toast for user feedback */
          toast.error("Failed to process voice command. Please try again.");
          setResponse('Sorry, I encountered an error processing your request.');
          setHindiResponse('क्षमा करें, मुझे आपके अनुरोध को प्रोसेस करने में त्रुटि हुई।');
        } finally {
          setIsProcessing(false);
        }
      };

      recognition.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsProcessing(false);
        if (event.error === 'not-allowed') {
          toast.error("Microphone access denied. Please allow microphone permissions.");
        } else if (event.error === 'no-speech') {
          toast.info("No speech detected. Please try again.");
        } else {
          toast.error(`Voice error: ${event.error}`);
        }
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };

      recognition.current.onstart = () => {
        console.log('Speech recognition started');
        toast.success("Listening... Speak now!");
      };
    } else {
      setIsSupported(false);
      toast.error("Voice recognition not supported in this browser.");
    }

    // Cleanup
    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, [selectedLanguage]);

  const startListening = () => {
    if (!isSupported) {
      toast.error("Voice recognition is not supported in this browser. Try Chrome.");
      return;
    }
    if (recognition.current && !isListening) {
      setTranscript('');
      setResponse('');
      setHindiResponse('');
      setIsListening(true);
      // Fallback logic repeated here
      recognition.current.lang = ['hi-IN', 'en-IN', 'bn-IN'].includes(selectedLanguage) ? selectedLanguage : 'en-IN';
      try {
        recognition.current.start();
      } catch (error) {
        console.error('Speech recognition start error:', error);
        toast.error("Could not start microphone.");
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

  const speakResponse = (text: string) => {
    const lang = selectedLanguage || 'hi-IN';
    speakText(text, lang, () => {
      setIsSpeaking(false);
    });
    setIsSpeaking(true);
  };

  const stopSpeaking = () => {
    stopSpeech();
    setIsSpeaking(false);
  };

  const pauseResumeSpeaking = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        if (speechSynthesis.speaking && !speechSynthesis.paused) {
          speechSynthesis.pause();
        } else {
          speechSynthesis.resume();
        }
      }
    }
  };

  const exampleQuestions = [
    { hindi: "गेहूं में रोग आ गया है, क्या करें?", english: "Wheat has disease, what to do?" },
    { hindi: "आज पानी देना चाहिए?", english: "Should I water today?" },
    { hindi: "फसल कब काटनी चाहिए?", english: "When should I harvest?" },
    { hindi: "खाद कितनी डालनी चाहिए?", english: "How much fertilizer to apply?" }
  ];

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <Card className="p-4">
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Languages className="w-5 h-5" />
          {t('voiceAssistant.demo.selectLang')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={selectedLanguage === lang.code ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLanguage(lang.code)}
              className="justify-start"
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* Voice Interface */}
      <Card className="p-6 text-center">
        <div className="space-y-4">
          <motion.div
            className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${isListening ? 'bg-red-500 animate-pulse' : 'bg-primary'
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`w-24 h-24 rounded-full transition-all duration-300 ${isListening ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-primary hover:bg-primary/90'
                }`}
            >
              {isListening ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </Button>
          </motion.div>

          <div className="space-y-2">
            <p className="text-lg font-semibold">
              {isListening ? t('voiceAssistant.demo.listening') : t('voiceAssistant.demo.pressToSpeak')}
            </p>
            {isProcessing && (
              <p className="text-muted-foreground">{t('voiceAssistant.demo.processing')}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Transcript and Response */}
      {transcript && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Mic className="w-4 h-4" />
              {t('voiceAssistant.demo.youSaid')}
            </h4>
            <p className="text-muted-foreground">{transcript}</p>
          </Card>

          {response && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold flex items-center gap-2">
                  {t('voiceAssistant.demo.aiResponse')}
                </h4>
                <div className="flex gap-2">
                  {isSpeaking ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={pauseResumeSpeaking}
                      >
                        {speechSynthesis.paused ? '▶️' : '⏸️'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={stopSpeaking}
                      >
                        ⏹️
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => speakResponse(response || hindiResponse)}
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-primary font-medium text-lg leading-relaxed">{response}</p>
              </div>
            </Card>
          )}
        </motion.div >
      )}

      {/* Example Questions */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3">{t('voiceAssistant.demo.exampleQuestionsTitle')}</h4>
        <div className="grid gap-2">
          {exampleQuestions.map((q, i) => (
            <div key={i} className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTranscript(q.hindi);
                  // Simulate voice processing
                  setIsProcessing(true);
                  setTimeout(async () => {
                    try {
                      // Use improved voice assistant backend
                      const response = await fetch('http://localhost:5000/voice-query', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          text: q.hindi,
                          language: 'hi-IN', // Examples are in Hindi
                          dialect: dialect
                        })
                      });

                      let aiResponse = '';
                      let hindiTranslation = '';

                      if (response.ok) {
                        const data = await response.json();
                        aiResponse = data.response.text;
                        hindiTranslation = data.response.audio_text;
                      } else {
                        // Fallback to mock AI
                        aiResponse = await mockChatWithAI(q.hindi);
                        hindiTranslation = aiResponse;
                      }

                      setResponse(aiResponse);
                      setHindiResponse(hindiTranslation);
                      speakResponse(aiResponse);
                    } catch (error) {
                      console.error('Voice query error:', error);
                      setResponse('Sorry, I encountered an error.');
                      setHindiResponse('क्षमा करें, मुझे त्रुटि हुई।');
                    } finally {
                      setIsProcessing(false);
                    }
                  }, 1000);
                }}
                className="text-left justify-start h-auto p-3 w-full"
              >
                <div className="flex-1">
                  <p className="font-medium">{q.hindi}</p>
                  <p className="text-xs text-muted-foreground">{q.english}</p>
                </div>
              </Button>
              {isSpeaking && (
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={pauseResumeSpeaking}
                  >
                    {speechSynthesis.paused ? '▶️' : '⏸️'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={stopSpeaking}
                  >
                    ⏹️
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Browser Support Note */}
      <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
        <p><strong>{t('voiceAssistant.demo.noteTitle')}:</strong> {t('voiceAssistant.demo.noteDesc')}</p>
        <p>{t('voiceAssistant.demo.noteHindiDesc')}</p>
      </div>
    </div >
  );
};

export default VoiceRecognition;