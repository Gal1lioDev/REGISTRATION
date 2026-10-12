import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, Terminal, ShieldCheck } from 'lucide-react';
import type { RegistrationResult } from '../types';

interface RegistrationSuccessProps {
  result: RegistrationResult;
  onClose: () => void;
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
  result,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.registration_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#090d12] border border-emerald-500/40 rounded-lg shadow-[0_0_30px_rgba(16,185,129,0.15)] text-xs sm:text-sm font-mono overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#101720] border-b border-[#1f2937] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-bold tracking-widest text-xs uppercase">
              REGISTRATION CONFIRMED // ACCESS GRANTED
            </span>
          </div>
          <span className="text-[10px] text-gray-500 font-mono">STATUS: 200 OK</span>
        </div>

        {/* Success Card Body */}
        <div className="p-5 sm:p-6 space-y-5 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wider">
              SQUAD ENROLLED IN DEFCON 2.0
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Your registration has been securely committed to the tournament database.
            </p>
          </div>

          {/* Registration Code Badge */}
          <div className="p-3.5 bg-[#05080c] border border-emerald-500/40 rounded-md flex flex-col items-center space-y-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">
              OFFICIAL REGISTRATION IDENTIFIER
            </span>
            <div className="flex items-center space-x-2.5">
              <span className="text-lg sm:text-xl font-bold text-emerald-400 tracking-wider">
                {result.registration_code}
              </span>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded bg-[#16202c] hover:bg-[#202d3e] text-gray-300 hover:text-white border border-[#232f3f] transition-colors"
                title="Copy Registration ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            {copied && <span className="text-[10px] text-emerald-400">Copied to clipboard</span>}
          </div>

          {/* Team Details Summary */}
          <div className="bg-[#0e141c] border border-[#1f2937] rounded p-3.5 text-left text-xs space-y-2">
            <div className="flex justify-between border-b border-[#1b2533] pb-1.5">
              <span className="text-gray-500">Team Name:</span>
              <span className="text-gray-200 font-bold">{result.team_name}</span>
            </div>
            <div className="flex justify-between border-b border-[#1b2533] pb-1.5">
              <span className="text-gray-500">Institution:</span>
              <span className="text-gray-300">{result.institution}</span>
            </div>
            <div className="flex justify-between border-b border-[#1b2533] pb-1.5">
              <span className="text-gray-500">Team Leader:</span>
              <span className="text-gray-300">{result.leader_name}</span>
            </div>
            <div className="flex justify-between border-b border-[#1b2533] pb-1.5">
              <span className="text-gray-500">Team Size:</span>
              <span className="text-gray-300">{result.team_size} Participant(s)</span>
            </div>
            {result.members && result.members.length > 0 && (
              <div className="pt-0.5">
                <span className="text-gray-500 block mb-1">Squad Members:</span>
                <div className="flex flex-wrap gap-1">
                  {result.members.map((m, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-[#16212e] text-gray-300 text-[11px] border border-[#223143]"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Next Instructions */}
          <div className="text-[11px] text-gray-400 bg-[#070b10] p-3 rounded border border-[#182330] text-left space-y-1">
            <p className="text-gray-300 font-semibold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              Next Steps for your Team:
            </p>
            <p>1. Save your Registration ID for venue check-in on the competition day.</p>
            <p>2. Bring your laptops, chargers, and network cables to NIT Warangal.</p>
            <p>3. Further briefing & VPN keys will be distributed prior to the 4-hour engagement.</p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold tracking-wider uppercase transition-colors"
          >
            RETURN TO TERMINAL
          </button>
        </div>
      </div>
    </div>
  );
};
