'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Bell,
  X,
  AlertTriangle,
  Pill,
  Clock,
  ShieldAlert,
  RotateCw,
  CheckCheck,
} from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    currentUser,
    markNotificationRead,
    clearAllNotifications,
  } = useApp();

  if (!isOpen) return null;

  // Filter for role or all
  const filteredNotifs = notifications.filter(
    (n) => n.targetRole === 'all' || n.targetRole === currentUser.role
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'drift':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'escalation':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case 'refill':
        return <RotateCw className="w-4 h-4 text-sky-600" />;
      case 'medicine':
        return <Pill className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-elder-600" />
            <h3 className="font-bold text-base text-slate-900">Notifications & Escalation Feed</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            Filtered for: <strong className="text-slate-800 capitalize">{currentUser.role}</strong>
          </span>
          <button
            onClick={clearAllNotifications}
            className="text-elder-700 hover:underline font-semibold flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              No new alerts. Care routines are running smoothly!
            </div>
          ) : (
            filteredNotifs.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3 rounded-xl border transition cursor-pointer ${
                  !n.read
                    ? 'bg-elder-50/50 border-elder-200 shadow-xs'
                    : 'bg-white border-slate-200 opacity-75'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900">{n.title}</h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-elder-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-2 block flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(n.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
