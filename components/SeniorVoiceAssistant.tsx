'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  PhoneCall,
  AlertOctagon,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Languages,
} from 'lucide-react';

interface SeniorVoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerSOS?: () => void;
}

export const SeniorVoiceAssistant: React.FC<SeniorVoiceAssistantProps> = ({
  isOpen,
  onClose,
  onTriggerSOS,
}) => {
  const {
    seniorProfile,
    todayDoseLogs,
    markDose,
    showToast,
  } = useApp();

  const [language, setLanguage] = useState<'en-IN' | 'hi-IN'>('en-IN');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantReply, setAssistantReply] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech Synthesis & Recognition
  const speakText = (text: string, lang = language) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setAssistantReply(text);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9; // Slightly slower, clear for seniors
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setAssistantReply(text);
    } catch (err) {
      console.warn('Speech synthesis failed:', err);
      setAssistantReply(text);
    }
  };

  const processVoiceCommand = (commandText: string) => {
    const text = commandText.toLowerCase().trim();
    setTranscript(commandText);

    // 1. Mark medicine taken
    if (
      text.includes('mark') ||
      text.includes('taken') ||
      text.includes('le li') ||
      text.includes('dawa') ||
      text.includes('dawai') ||
      text.includes('kha li')
    ) {
      const pending = todayDoseLogs.find((l) => l.status === 'pending') || todayDoseLogs[0];
      if (pending) {
        markDose(pending.id, 'taken');
        const reply =
          language === 'hi-IN'
            ? `बहुत बढ़िया रमेश जी! आपकी ${pending.medicineName} दवाई ले ली गई मार्क कर दी गई है।`
            : `Great job, ${seniorProfile.name}! Your ${pending.medicineName} dose has been marked as taken.`;
        speakText(reply);
      } else {
        const reply =
          language === 'hi-IN'
            ? 'आपकी आज की सभी दवाइयाँ पहले ही ली जा चुकी हैं।'
            : 'All scheduled medicines for today have already been completed!';
        speakText(reply);
      }
      return;
    }

    // 2. What is my next medicine
    if (
      text.includes('next') ||
      text.includes('agli') ||
      text.includes('what is') ||
      text.includes('kab') ||
      text.includes('time')
    ) {
      const nextPending = todayDoseLogs.find((l) => l.status === 'pending');
      if (nextPending) {
        const reply =
          language === 'hi-IN'
            ? `आपकी अगली दवाई ${nextPending.medicineName} है, जो ${nextPending.scheduledTime} बजे लेनी है।`
            : `Your next scheduled medicine is ${nextPending.medicineName} at ${nextPending.scheduledTime}.`;
        speakText(reply);
      } else {
        const reply =
          language === 'hi-IN'
            ? 'आज के लिए कोई नई दवाई बाकी नहीं है।'
            : 'No remaining medicines scheduled for today.';
        speakText(reply);
      }
      return;
    }

    // 3. Call my son
    if (
      text.includes('call') ||
      text.includes('son') ||
      text.includes('beta') ||
      text.includes('bete') ||
      text.includes('aarav') ||
      text.includes('phone')
    ) {
      const reply =
        language === 'hi-IN'
          ? 'आपके बेटे आरव शर्मा को कॉल मिलाया जा रहा है।'
          : 'Connecting phone call to your son, Aarav Sharma.';
      speakText(reply);
      setTimeout(() => {
        window.open('tel:+919811154321', '_self');
      }, 1500);
      return;
    }

    // 4. Emergency SOS
    if (
      text.includes('sos') ||
      text.includes('emergency') ||
      text.includes('help') ||
      text.includes('madad') ||
      text.includes('khatra')
    ) {
      const reply =
        language === 'hi-IN'
          ? 'आपातकालीन एसओएस अलर्ट भेज दिया गया है। परिवार और केयरटेकर को सूचना मिल गई है।'
          : 'Emergency SOS activated! Notifying family and care team immediately.';
      speakText(reply);
      if (onTriggerSOS) onTriggerSOS();
      return;
    }

    // Unknown command fallback
    const fallback =
      language === 'hi-IN'
        ? 'माफ़ कीजिए, मैंने समझा नहीं। आप कह सकते हैं: "दवाई ले ली", "अगली दवाई क्या है", या "बेटे को कॉल करो"।'
        : 'I didn\'t quite catch that. You can say: "Mark medicine taken", "What is my next medicine", or "Call my son".';
    speakText(fallback);
  };

  const startListening = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('Speech recognition not supported in this browser. Please use the quick command buttons below!');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = language;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('Listening...');
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        processVoiceCommand(text);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setTranscript('Microphone unavailable. Use quick buttons below.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Recognition start failed:', err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-700 animate-scale-up space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-elder-500/20 text-elder-400 flex items-center justify-center">
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">
                Senior Voice Assistant
              </h3>
              <p className="text-xs text-slate-400">
                Web Speech API • Hindi (hi-IN) & English (en-IN)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              onClick={() => {
                const next = language === 'en-IN' ? 'hi-IN' : 'en-IN';
                setLanguage(next);
                showToast(`Voice assistant language: ${next === 'hi-IN' ? 'हिंदी (Hindi)' : 'English (India)'}`);
              }}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-elder-300 border border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{language === 'hi-IN' ? 'हिंदी' : 'English'}</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Big Mic Button & Visual Feedback */}
        <div className="text-center py-6 space-y-4">
          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-28 h-28 rounded-full mx-auto flex items-center justify-center transition-transform active:scale-95 shadow-xl ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-500/30'
                : 'bg-elder-500 hover:bg-elder-400 text-slate-950 ring-8 ring-elder-500/20'
            }`}
          >
            {isListening ? (
              <MicOff className="w-12 h-12" />
            ) : (
              <Mic className="w-12 h-12" />
            )}
          </button>

          <p className="text-sm font-semibold text-slate-300">
            {isListening
              ? language === 'hi-IN'
                ? 'सुन रहा हूँ... बोलिए'
                : 'Listening... Please speak your command'
              : language === 'hi-IN'
              ? 'बोलने के लिए माइक दबाएँ'
              : 'Tap microphone to speak'}
          </p>

          {transcript && (
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs text-elder-300 font-mono">
              &quot;{transcript}&quot;
            </div>
          )}

          {assistantReply && (
            <div className="bg-elder-950/70 p-4 rounded-xl border border-elder-500/40 text-sm text-slate-100 font-medium leading-relaxed flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-elder-400 shrink-0" />
              <span>{assistantReply}</span>
            </div>
          )}
        </div>

        {/* 4 Guaranteed Clickable Voice Command Shortcuts */}
        <div className="space-y-2 pt-4 border-t border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Quick Voice Commands (Click to simulate speaking):
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              onClick={() =>
                processVoiceCommand(
                  language === 'hi-IN' ? 'मैंने दवाई ले ली' : 'Mark my medicine taken'
                )
              }
              className="p-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 flex items-center gap-2 text-left font-semibold transition"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{language === 'hi-IN' ? 'दवाई ले ली (Mark Taken)' : 'Mark medicine taken'}</span>
            </button>

            <button
              onClick={() =>
                processVoiceCommand(
                  language === 'hi-IN' ? 'मेरी अगली दवाई क्या है' : 'What is my next medicine'
                )
              }
              className="p-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 flex items-center gap-2 text-left font-semibold transition"
            >
              <Sparkles className="w-4 h-4 text-elder-400 shrink-0" />
              <span>{language === 'hi-IN' ? 'अगली दवाई (Next Medicine)' : 'What is next medicine'}</span>
            </button>

            <button
              onClick={() =>
                processVoiceCommand(
                  language === 'hi-IN' ? 'बेटे को कॉल करो' : 'Call my son Aarav'
                )
              }
              className="p-3 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 flex items-center gap-2 text-left font-semibold transition"
            >
              <PhoneCall className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{language === 'hi-IN' ? 'बेटे को कॉल करो' : 'Call son (Aarav)'}</span>
            </button>

            <button
              onClick={() =>
                processVoiceCommand(language === 'hi-IN' ? 'मदद चाहिए आपातकाल' : 'Emergency SOS')
              }
              className="p-3 bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 rounded-xl border border-rose-700/80 flex items-center gap-2 text-left font-bold transition"
            >
              <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{language === 'hi-IN' ? 'आपातकाल (Emergency SOS)' : 'Emergency SOS'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
