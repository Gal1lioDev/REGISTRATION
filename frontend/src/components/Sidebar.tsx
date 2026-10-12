import React from 'react';
import { Lock, Unlock, CheckCircle2, ShieldCheck, Terminal, Users, Calendar, MapPin, Clock } from 'lucide-react';
import type { SessionData } from '../types';

interface SidebarProps {
  sessionData: SessionData | null;
  onOpenRegister: () => void;
  onRunCommand: (cmd: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessionData,
  onOpenRegister,
  onRunCommand,
}) => {
  const c1Done = sessionData?.challenge_1_completed ?? false;
  const c2Done = sessionData?.challenge_2_completed ?? false;
  const completedCount = sessionData?.completed_count ?? 0;
  const total = 2;
  const isUnlocked = sessionData?.is_eligible ?? false;
  const isRegistered = sessionData?.registered ?? false;

  const event = sessionData?.event_info ?? {
    name: 'DEFCON 2.0',
    format: 'Attack – Defense',
    duration: '4 Hours',
    mode: 'Team (1 – 4 members)',
    venue: 'NIT Warangal',
    date: 'October 24, 2026',
  };

  const progressPercentage = (completedCount / total) * 100;

  return (
    <aside className="w-full flex flex-col gap-3 p-3 sm:p-3.5 bg-[#0a0e13] text-xs font-mono">
      {/* 1. Challenge Progress Card */}
      <div className="rounded border border-[#1f2937] bg-[#0d1218] p-3.5 shadow-sm">
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#1a2330]">
          <span className="font-bold text-gray-200 tracking-wider text-[11px] uppercase flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            Your Progress
          </span>
          <span className="text-[11px] font-bold text-emerald-400">
            {completedCount} / {total}
          </span>
        </div>

        {/* Rows */}
        <div className="space-y-2 mb-3">
          {/* Challenge 1: Recon */}
          <div
            onClick={() => !c1Done && onRunCommand('challenge 1')}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded border transition-colors ${
              c1Done
                ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300'
                : 'border-[#1f2937] bg-[#090d12] text-gray-400 hover:border-gray-600 cursor-pointer'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={c1Done ? 'text-emerald-400 font-bold' : 'text-gray-500'}>
                {c1Done ? '[✓]' : '[ ]'}
              </span>
              <span className="font-semibold tracking-wide">RECON</span>
            </div>
            <span className="text-[10px] text-gray-500 font-mono">(EASY)</span>
          </div>

          {/* Challenge 2: Decode */}
          <div
            onClick={() => !c2Done && onRunCommand('challenge 2')}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded border transition-colors ${
              c2Done
                ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300'
                : 'border-[#1f2937] bg-[#090d12] text-gray-400 hover:border-gray-600 cursor-pointer'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={c2Done ? 'text-emerald-400 font-bold' : 'text-gray-500'}>
                {c2Done ? '[✓]' : '[ ]'}
              </span>
              <span className="font-semibold tracking-wide">DECODE</span>
            </div>
            <span className="text-[10px] text-gray-500 font-mono">(EASY)</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-[#16202c] rounded-full h-2 overflow-hidden border border-[#223143]">
            <div
              className="bg-emerald-400 h-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Event Information Card */}
      <div className="rounded border border-[#1f2937] bg-[#0d1218] p-3.5 shadow-sm">
        <div className="pb-2 mb-2.5 border-b border-[#1a2330]">
          <span className="font-bold text-gray-200 tracking-wider text-[11px] uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            Event Info
          </span>
        </div>

        <div className="space-y-2 text-[11px]">
          <div className="flex justify-between items-center py-0.5">
            <span className="text-gray-500">Name</span>
            <span className="text-gray-200 font-semibold">{event.name}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-gray-500">Format</span>
            <span className="text-gray-300 font-mono">{event.format}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-gray-500" /> Duration
            </span>
            <span className="text-gray-300">{event.duration}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-gray-500 flex items-center gap-1">
              <Users className="w-3 h-3 text-gray-500" /> Mode
            </span>
            <span className="text-gray-300">{event.mode}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-gray-500" /> Date
            </span>
            <span className="text-gray-300">{event.date}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gray-500" /> Venue
            </span>
            <span className="text-gray-300 font-semibold text-right">{event.venue}</span>
          </div>
        </div>
      </div>

      {/* 3. Registration Status Card */}
      <div className={`rounded border p-3.5 shadow-sm transition-all ${
        isUnlocked
          ? 'border-emerald-500/40 bg-[#0d1713]'
          : 'border-[#1f2937] bg-[#0d1218]'
      }`}>
        <div className="pb-2 mb-2.5 border-b border-[#1a2330]">
          <span className="font-bold text-gray-200 tracking-wider text-[11px] uppercase flex items-center gap-1.5">
            {isUnlocked ? (
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-red-400" />
            )}
            Registration
          </span>
        </div>

        {isRegistered ? (
          <div className="space-y-2 text-center py-1">
            <div className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              REGISTERED
            </div>
            <p className="text-[10px] text-gray-400">
              Registration Code:
            </p>
            <div className="font-mono text-xs text-white bg-black/40 border border-emerald-500/30 px-2 py-1 rounded">
              {sessionData?.registration_code}
            </div>
          </div>
        ) : isUnlocked ? (
          <div className="space-y-2.5 py-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <Unlock className="w-4 h-4 text-emerald-400" />
              <span>ACCESS UNLOCKED</span>
            </div>
            <p className="text-[10px] text-gray-300 leading-relaxed">
              Both challenges verified by server. Type <span className="text-emerald-400 font-bold">register</span> in the terminal or click below.
            </p>
            <button
              onClick={onOpenRegister}
              className="w-full mt-2 py-2 px-3 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:shadow-[0_0_16px_rgba(16,185,129,0.5)] active:scale-[0.99]"
            >
              [ REGISTER TEAM NOW ]
            </button>
          </div>
        ) : (
          <div className="space-y-2 py-1">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
              <Lock className="w-4 h-4 text-red-400" />
              <span>Locked</span>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Solve both challenges to unlock registration. Remaining:{' '}
              <span className="text-red-400 font-bold">{total - completedCount}</span>
            </p>
            <div className="text-[10px] text-gray-500 bg-[#090d12] p-2 rounded border border-[#1a2330]">
              Tip: Type <span className="text-amber-400">challenges</span> in the terminal to inspect the active tasks.
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
