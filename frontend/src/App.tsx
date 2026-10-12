import React, { useState, useEffect, useRef } from 'react';
import { HeroBanner } from './components/HeroBanner';
import { Terminal } from './components/Terminal';
import { Sidebar } from './components/Sidebar';
import { RegistrationModal } from './components/RegistrationModal';
import { RegistrationSuccess } from './components/RegistrationSuccess';
import { AdminDashboard } from './components/AdminDashboard';
import type { SessionData, RegistrationResult } from './types';
import { api } from './services/api';

export const App: React.FC = () => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<RegistrationResult | null>(null);

  const runExternalCommandRef = useRef<((cmd: string) => void) | null>(null);

  const fetchSession = async () => {
    try {
      const data = await api.getSession();
      setSessionData(data);
    } catch (err) {
      console.error('Failed to load session:', err);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const handleOpenRegister = () => {
    if (sessionData?.registered) {
      return;
    }
    if (sessionData?.is_eligible) {
      setIsRegisterOpen(true);
    }
  };

  const handleRegistrationCompleted = (result: RegistrationResult) => {
    setIsRegisterOpen(false);
    setRegistrationSuccess(result);
    fetchSession();
  };

  const handleRunCommand = (cmd: string) => {
    if (runExternalCommandRef.current) {
      runExternalCommandRef.current(cmd);
    }
  };

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-[#05070a] text-gray-200 flex flex-col font-mono selection:bg-[#00ff66]/25 selection:text-white">
      {/* 1. Attached Exact Hero Banner (Fixed Height, No Window Resizing) */}
      <div className="shrink-0 w-full">
        <HeroBanner />
      </div>

      {/* 2. Main Workstation Area (Occupies Remaining Viewport Height, Never Scrolls Window) */}
      <main className="flex-1 min-h-0 w-full max-w-7xl mx-auto px-2 sm:px-4 py-2 flex flex-col overflow-hidden">
        <div className="w-full h-full flex-1 min-h-0 flex flex-col lg:flex-row border border-[#1f2937] rounded-lg overflow-hidden bg-[#080b0e] shadow-2xl">
          {/* Left Column (~72%): Self-Contained Simulated Terminal Box */}
          <div className="w-full lg:w-[72%] h-full min-h-0 flex flex-col border-b lg:border-b-0 lg:border-r border-[#1f2937] overflow-hidden">
            <Terminal
              sessionData={sessionData}
              onRefreshSession={fetchSession}
              onOpenRegister={handleOpenRegister}
              onOpenAdmin={() => setIsAdminOpen(true)}
              runExternalCommandRef={runExternalCommandRef}
            />
          </div>

          {/* Right Column (~28%): Sidebar Cards (Independently Scrollable if Needed) */}
          <div className="w-full lg:w-[28%] h-full min-h-0 flex flex-col bg-[#0a0e13] overflow-y-auto">
            <Sidebar
              sessionData={sessionData}
              onOpenRegister={handleOpenRegister}
              onRunCommand={handleRunCommand}
            />
          </div>
        </div>
      </main>

      {/* 3. Bottom Status Bar */}
      <footer className="shrink-0 border-t border-[#1a2330] py-1.5 px-4 text-[11px] text-gray-500 bg-[#05070a]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="tracking-wide text-gray-400">
            DEFCON 2.0 &bull; 4-Hour Attack–Defense Cyberwarfare &bull; NIT Warangal
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="text-gray-400 hover:text-[#00ff66] transition-colors font-mono"
            >
              [admin portal]
            </button>
            <span className="text-gray-700">&bull;</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>
        </div>
      </footer>

      {/* Registration & Admin Overlays */}
      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={handleRegistrationCompleted}
      />

      {registrationSuccess && (
        <RegistrationSuccess
          result={registrationSuccess}
          onClose={() => setRegistrationSuccess(null)}
        />
      )}

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
};

export default App;
