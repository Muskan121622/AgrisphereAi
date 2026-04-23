import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Square, Play, Trash2, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "@/components/ui/use-toast";

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob) => void;
  className?: string;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSend, className }) => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      // Default onstop if interrupted unexpectedly (we override this in send/cancel)
      mediaRecorder.onstop = () => {
        streamRef.current?.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        title: t("common.error"),
        description: t("voiceAssistant.demo.micDenied"),
        variant: "destructive",
      });
    }
  };

  const stopAndSend = () => {
    if (mediaRecorderRef.current && isRecording) {
      // Temporarily override the onstop behavior to send immediately
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        onSend(blob);
        streamRef.current?.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        setRecordingTime(0);
      };
      mediaRecorderRef.current.stop();
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      // Temporarily override the onstop to just discard
      mediaRecorderRef.current.onstop = () => {
        streamRef.current?.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        setRecordingTime(0);
      };
      mediaRecorderRef.current.stop();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isRecording ? (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-full animate-pulse shadow-md">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-mono text-red-500 font-bold w-10">{formatTime(recordingTime)}</span>
          
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 ml-2"
            onClick={cancelRecording}
            title={t("common.cancel")}
          >
            <Trash2 className="h-3 w-3" />
          </Button>

          <Button 
            size="icon" 
            className="h-8 w-8 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20"
            onClick={stopAndSend}
            title={t("common.send")}
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Button
          size="icon"
          variant="outline"
          className="border-slate-700 hover:bg-slate-800 hover:border-green-500/50 text-slate-400 hover:text-green-500 transition-all shadow-sm"
          onClick={startRecording}
          title={t("community.voiceMessage")}
        >
          <Mic className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default VoiceRecorder;
