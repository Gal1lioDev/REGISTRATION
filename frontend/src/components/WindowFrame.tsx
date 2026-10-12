import React from 'react';

interface WindowFrameProps {
  title?: string;
  onOpenAdmin?: () => void;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  title = 'participant@defcon-terminal-v2.0: ~',
  onOpenAdmin,
  children,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto rounded-lg border border-[#1f2937] bg-[#0c1015] shadow-2xl overflow-hidden my-3 md:my-5 flex flex-col">
      {/* Title Bar */}
      <div className="bg-[#121820] border-b border-[#1f2937] px-4 py-2.5 flex items-center justify-between select-none">
        {/* Left: Window Controls */}
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444] border border-[#dc2626]/50 shadow-sm cursor-pointer hover:opacity-80 transition-opacity" title="Close" />
          <div className="w-3 h-3 rounded-full bg-[#f59e0b] border border-[#d97706]/50 shadow-sm cursor-pointer hover:opacity-80 transition-opacity" title="Minimize" />
          <div className="w-3 h-3 rounded-full bg-[#10b981] border border-[#059669]/50 shadow-sm cursor-pointer hover:opacity-80 transition-opacity" title="Maximize" />
          <span className="hidden sm:inline-block ml-3 text-xs font-mono text-gray-500">
            TTY: pts/0
          </span>
        </div>

        {/* Center: Title */}
        <div className="text-xs sm:text-sm font-mono font-medium text-gray-300 tracking-wide truncate max-w-xs sm:max-w-md text-center">
          {title}
        </div>

        {/* Right: Status & Admin button */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-[11px] font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">ONLINE</span>
          </div>
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="text-[11px] font-mono text-gray-400 hover:text-white px-2 py-0.5 rounded border border-gray-700/60 hover:border-gray-500 transition-colors"
              title="Open Admin Console"
            >
              [admin]
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
};
