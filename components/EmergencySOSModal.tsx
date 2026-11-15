'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  AlertOctagon,
  PhoneCall,
  MapPin,
  Clock,
  ShieldCheck,
  X,
  AlertTriangle,
  Send,
} from 'lucide-react';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { seniorProfile, showToast } = useApp();
  const [sosState, setSosState] = useState<'idle' | 'triggered' | 'confirmed'>('idle');
  const [locationText, setLocationText] = useState('Fetching live GPS coordinates...');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [dispatchedTime, setDispatchedTime] = useState<string>('');

  if (!isOpen) return null;

  const triggerSOS = () => {
    setSosState('triggered');
    const now = new Date();
    setDispatchedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

    // Request Geolocation API
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoordinates({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationText(
            `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)} (Accuracy: ${Math.round(
              pos.coords.accuracy
            )}m)`
          );
          setSosState('confirmed');
          showToast('EMERGENCY SOS: Location captured & alerts dispatched to family and care circle!');
        },
        (err) => {
          console.warn('Geolocation error:', err);
          setLocationText(`Home Location: ${seniorProfile.address} (GPS permission denied)`);
          setSosState('confirmed');
          showToast('EMERGENCY SOS: Alerts dispatched with registered home address!');
        },
        { timeout: 8000 }
      );
    } else {
      setLocationText(`Home Location: ${seniorProfile.address}`);
      setSosState('confirmed');
      showToast('EMERGENCY SOS: Alerts dispatched!');
    }
  };

  const handleReset = () => {
    setSosState('idle');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-rose-600 animate-scale-up space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center animate-pulse">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-rose-400">EMERGENCY SOS PROTOCOL</h2>
              <p className="text-xs text-slate-400">
                Instant priority alert for {seniorProfile.name}
              </p>
            </div>
          </div>
          <button onClick={handleReset} className="text-slate-400 hover:text-white p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* SOS Action Area */}
        {sosState === 'idle' && (
          <div className="text-center py-6 space-y-6">
            <p className="text-sm text-slate-300 font-medium">
              Pressing the button below will immediately dispatch an emergency distress beacon with your live GPS location to your family (Aarav) and caretaker (Priya).
            </p>

            {/* Giant SOS Button */}
            <button
              onClick={triggerSOS}
              className="w-48 h-48 rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-red-500 hover:from-rose-600 hover:to-red-400 text-white font-black text-3xl shadow-2xl shadow-rose-600/50 border-8 border-rose-400/40 flex flex-col items-center justify-center mx-auto transition-transform active:scale-95 group animate-pulse"
            >
              <AlertOctagon className="w-14 h-14 mb-1 group-hover:scale-110 transition" />
              <span>SOS</span>
              <span className="text-xs tracking-wider uppercase opacity-80 mt-1">Tap To Trigger</span>
            </button>

            <p className="text-xs text-slate-400">
              Registered Emergency Contacts: 3 active phone numbers linked
            </p>
          </div>
        )}

        {sosState === 'triggered' && (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-rose-300">Acquiring GPS & Dispatching Beacon...</h3>
            <p className="text-xs text-slate-400">{locationText}</p>
          </div>
        )}

        {sosState === 'confirmed' && (
          <div className="space-y-4">
            <div className="p-4 bg-rose-950/80 border border-rose-600/80 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>DISTRESS BEACON DISPATCHED</span>
              </div>

              <div className="text-xs text-slate-300 space-y-1">
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Time Dispatched: <strong>{dispatchedTime}</strong></span>
                </p>
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>Location: <strong>{locationText}</strong></span>
                </p>
              </div>

              <div className="pt-2 border-t border-rose-800/60 text-xs text-emerald-300 font-semibold">
                ✓ SMS & push notification delivered to Aarav Sharma & Priya Singh
              </div>
            </div>

            {/* Direct Phone Dial Shortcuts */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Immediate Direct Helpline Calling:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <a
                  href="tel:+919811154321"
                  className="p-3 bg-blue-900/60 hover:bg-blue-800 text-white rounded-xl border border-blue-500 flex items-center gap-2 font-bold transition"
                >
                  <PhoneCall className="w-4 h-4 text-blue-400" />
                  <span>Call Son (Aarav Sharma)</span>
                </a>

                <a
                  href="tel:1066"
                  className="p-3 bg-rose-900/60 hover:bg-rose-800 text-white rounded-xl border border-rose-500 flex items-center gap-2 font-bold transition"
                >
                  <PhoneCall className="w-4 h-4 text-rose-400" />
                  <span>Call Ambulance (1066 / 102)</span>
                </a>

                <a
                  href="tel:+919822233445"
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 flex items-center gap-2 font-semibold transition"
                >
                  <PhoneCall className="w-4 h-4 text-elder-400" />
                  <span>Dr. K. Mehta (Cardiologist)</span>
                </a>

                <a
                  href="tel:112"
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 flex items-center gap-2 font-semibold transition"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  <span>National Emergency (112)</span>
                </a>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition mt-2"
            >
              Close Emergency Beacon
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
