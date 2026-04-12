import axios from "axios";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_CHATBOT_API_KEY;

/**
 * Simplifies complex scheme text into simple Hindi/English for farmers using the backend AI service.
 * Always falls back to original text if AI fails to prevent technical errors showing.
 */
export const simplifyTextForFarmer = async (text: string, language: string = "Hindi"): Promise<string> => {
    try {
        const response = await axios.post("http://localhost:5000/simplify-text", {
            text,
            language
        });

        return response.data.simplified_text || text;

    } catch (error: any) {
        console.error("Simplification error, falling back to original:", error);
        // Important: Return original text instead of error to maintain UX
        return text;
    }
};

/**
 * Stops any ongoing speech.
 */
export const stopSpeech = () => {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
};

/**
 * Splits text into meaningful chunks for more reliable speech synthesis,
 * especially for long sentences that might time out with online voices.
 */
const splitTextIntoChunks = (text: string): string[] => {
    // Split by common sentence terminators in multiple scripts (English, Hindi, etc.)
    const chunks = text.split(/([।.!?;,।\n])/g);
    const results: string[] = [];
    let current = "";

    for (let i = 0; i < chunks.length; i++) {
        current += chunks[i];
        // If chunk is reasonably long or we hit a terminator, push it
        if (current.length > 80 || i % 2 === 1) {
            if (current.trim()) results.push(current.trim());
            current = "";
        }
    }
    if (current.trim()) results.push(current.trim());
    return results;
};

/**
 * Speaks the text using Web Speech API with smart voice fallback.
 * Includes automatic chunking and fallback from Online to Local voices if failure occurs.
 */
export const speakText = (text: string, lang: string = "hi-IN", onEnd?: () => void, isFallbackAttempt = false, startChunk = 0) => {
    if (!window.speechSynthesis) {
        console.warn("Speech synthesis not supported.");
        if (onEnd) onEnd();
        return;
    }

    // Stop previous speech if this is a fresh request
    if (!isFallbackAttempt) {
        stopSpeech();
    }

    const langFallbackMap: Record<string, string[]> = {
        'as-IN': ['as-IN', 'bn-IN', 'hi-IN', 'en-IN', 'en-US'],
        'kn-IN': ['kn-IN', 'te-IN', 'hi-IN', 'en-IN', 'en-US'],
        'bn-IN': ['bn-IN', 'hi-IN', 'en-IN', 'en-US'],
        'hi-IN': ['hi-IN', 'en-IN', 'en-US'],
        'en-IN': ['en-IN', 'en-US'],
        'mr-IN': ['mr-IN', 'hi-IN', 'en-IN', 'en-US'],
        'ta-IN': ['ta-IN', 'te-IN', 'en-IN', 'en-US'],
        'te-IN': ['te-IN', 'ta-IN', 'en-IN', 'en-US'],
    };

    const doSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        
        // Log available voices for the requested language to help debug
        const languageVoices = voices.filter(v => v.lang.startsWith(lang.split('-')[0]));
        console.log(`Speech: Available voices for ${lang}:`, languageVoices.map(v => `${v.name} (${v.localService ? 'Local' : 'Online'})`));

        const fallbacks = langFallbackMap[lang] || [lang, 'hi-IN', 'en-IN', 'en-US'];

        let selectedVoice: SpeechSynthesisVoice | null = null;
        let chosenLang = lang;

        // Try to find the best voice
        for (const fallbackLang of fallbacks) {
            const availableVoices = voices.filter(
                v => v.lang === fallbackLang || v.lang.startsWith(fallbackLang.split('-')[0])
            );
            
            if (availableVoices.length > 0) {
                if (isFallbackAttempt) {
                    // Try to avoid the specific type of voice that failed (Natural/Online)
                    selectedVoice = availableVoices.find(v => !v.name.includes("Natural") && !v.name.includes("Online")) || availableVoices[0];
                } else {
                    // Start with high quality voices if available
                    selectedVoice = availableVoices.find(v => v.name.includes("Natural") || v.name.includes("Online")) || availableVoices[0];
                }
                chosenLang = fallbackLang;
                break;
            }
        }

        console.log(`Speech: Attempting ${chosenLang} using voice ${selectedVoice?.name || 'default'} (IsFallback: ${isFallbackAttempt})`);

        const chunks = splitTextIntoChunks(text);
        let currentChunk = startChunk;

        const speakNextChunk = () => {
            if (currentChunk >= chunks.length) {
                if (onEnd) onEnd();
                return;
            }

            const utterance = new SpeechSynthesisUtterance(chunks[currentChunk]);
            utterance.lang = chosenLang;
            if (selectedVoice) utterance.voice = selectedVoice;
            
            // Slower rate for Hindi to handle complex conjuncts better
            utterance.rate = chosenLang.startsWith('hi') ? 0.85 : 1.0;
            utterance.pitch = 1;

            utterance.onend = () => {
                currentChunk++;
                speakNextChunk();
            };

            utterance.onerror = (e: any) => {
                console.error("Speech chunk error:", e);
                
                // If Natural voice fails, try the Local voice immediately from this same chunk
                if (!isFallbackAttempt && (e.error === 'synthesis-failed' || e.error === 'network')) {
                    console.warn(`Fallback: Chunk ${currentChunk} failed. Retrying with local voice from here...`);
                    stopSpeech();
                    speakText(text, lang, onEnd, true, currentChunk);
                } else {
                    if (onEnd) onEnd();
                }
            };

            window.speechSynthesis.speak(utterance);
        };

        speakNextChunk();
    };

    // Voices may not be loaded yet on first call
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
        doSpeak();
    } else {
        let voicesStarted = false;
        const checkVoices = () => {
             if (voicesStarted) return;
             if (window.speechSynthesis.getVoices().length > 0) {
                 voicesStarted = true;
                 window.speechSynthesis.onvoiceschanged = null;
                 doSpeak();
             }
        };
        window.speechSynthesis.onvoiceschanged = checkVoices;
        setTimeout(checkVoices, 100);
    }
};
