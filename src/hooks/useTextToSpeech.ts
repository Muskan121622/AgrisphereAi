import { useState, useEffect } from 'react';
import { speakText, stopSpeech } from '@/services/voiceService';

export const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        return () => {
            stopSpeech();
        };
    }, []);

    const speak = (text: string, lang = 'en-IN') => {
        setIsSpeaking(true);
        speakText(text, lang, () => {
            setIsSpeaking(false);
        });
    };

    const stop = () => {
        stopSpeech();
        setIsSpeaking(false);
    };

    return { isSpeaking, speak, stop };
};
