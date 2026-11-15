'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Copy, Check, Users, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose }) => {
  const { seniorProfile, linkWithInviteCode, currentUser } = useApp();
  const [enteredCode, setEnteredCode] = useState('');
  const [relation, setRelation] = useState(
    currentUser.role === 'family' ? 'Son' : 'Primary Nurse'
  );
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(seniorProfile.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const res = linkWithInviteCode(enteredCode, relation);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-elder-100 text-elder-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              Care Circle: Senior Invite Code
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Senior's active code display */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center mb-5">
          <p className="text-xs text-slate-500 font-medium">
            Active Invite Code for <strong>{seniorProfile.name}</strong>:
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="font-mono text-xl font-black tracking-widest text-elder-700 bg-white px-4 py-1.5 rounded-lg border border-elder-200 shadow-xs">
              {seniorProfile.inviteCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-2 bg-white hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 transition"
              title="Copy code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Share this code with your adult children, guardians, or caretakers to grant care circle access.
          </p>
        </div>

        {/* Link Form for Family / Caretakers */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
            <KeyRound className="w-4 h-4 text-elder-600" />
            <span>Connect to a Senior with an Invite Code</span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Enter 8-digit Invite Code:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. RAMESH-360"
              value={enteredCode}
              onChange={(e) => setEnteredCode(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg uppercase tracking-wider font-mono font-bold focus:outline-none focus:ring-2 focus:ring-elder-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Your Relationship to the Senior:
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Son, Daughter, Private Nurse"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-elder-500"
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center gap-1.5 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center gap-1.5 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-bold bg-elder-600 hover:bg-elder-700 text-white rounded-lg shadow"
            >
              Link to Senior
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
