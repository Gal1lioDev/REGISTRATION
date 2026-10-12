import React, { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import type { TerminalOutputItem, SessionData } from '../types';
import { api } from '../services/api';

interface TerminalProps {
  sessionData: SessionData | null;
  onRefreshSession: () => Promise<void>;
  onOpenRegister: () => void;
  onOpenAdmin: () => void;
  runExternalCommandRef?: React.MutableRefObject<((cmd: string) => void) | null>;
}

export const Terminal: React.FC<TerminalProps> = ({
  sessionData,
  onRefreshSession,
  onOpenRegister,
  onOpenAdmin,
  runExternalCommandRef,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<TerminalOutputItem[]>([
    {
      id: 'init-1',
      type: 'system',
      content:
        'Welcome to DEFCON 2.0 Registration Terminal.\n' +
        'Complete the challenges to unlock registration.\n' +
        'Type help for available commands.',
    },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(false);

  const outputContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFirstRender = useRef(true);

  // Scroll ONLY the internal terminal container, NEVER the window!
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (outputContainerRef.current) {
      outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
    }
  }, [history, isLoading]);

  // Maintain focus on input without scrolling the browser page
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, [isLoading]);

  // Handle external execution requests
  useEffect(() => {
    if (runExternalCommandRef) {
      runExternalCommandRef.current = (cmd: string) => {
        executeCommand(cmd);
      };
    }
  }, [sessionData]);

  const addOutput = (
    type: TerminalOutputItem['type'],
    content: string,
    command?: string
  ) => {
    setHistory((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type,
        content,
        command,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const executeCommand = async (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    // Record in command history
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    // Echo command in terminal
    addOutput('command', cmd, cmd);

    const lowerCmd = cmd.toLowerCase();

    // 1. CLEAR COMMAND
    if (lowerCmd === 'clear') {
      setHistory([]);
      return;
    }

    // 2. HELP COMMAND
    if (lowerCmd === 'help' || lowerCmd === '--help' || lowerCmd === '-h') {
      const helpText = [
        'Available commands:',
        '  help                 - Show this message',
        '  about                - Event details',
        '  challenges           - List challenges',
        '  challenge 1          - Inspect Challenge 1 (Recon)',
        '  challenge 2          - Inspect Challenge 2 (Decode)',
        '  hint 1               - Hint for Challenge 1',
        '  hint 2               - Hint for Challenge 2',
        '  submit 1 <keyword>   - Submit answer for Challenge 1',
        '  submit 2 <keyword>   - Submit answer for Challenge 2',
        '  status               - Check your progress',
        '  register             - Register for the event (unlocks after challenges)',
        '  clear                - Clear the terminal',
        '  admin                - Access admin dashboard',
        '',
        'Utility & Simulation:',
        '  echo <b64> | base64 -d  - Decode Base64 string safely',
      ].join('\n');
      addOutput('system', helpText);
      return;
    }

    // 3. ABOUT COMMAND
    if (lowerCmd === 'about') {
      const event = sessionData?.event_info;
      const aboutText = [
        '------------------------------------------------------------------------',
        'EVENT INFO: DEFCON 2.0',
        '------------------------------------------------------------------------',
        `Name        : ${event?.name || 'DEFCON 2.0'}`,
        `Format      : ${event?.format || 'Attack - Defense'}`,
        `Duration    : ${event?.duration || '4 Hours'}`,
        `Mode        : ${event?.mode || 'Team (1 - 4 members)'}`,
        `Date        : ${event?.date || 'October 24, 2026'}`,
        `Venue       : ${event?.venue || 'NIT Warangal'}`,
        '------------------------------------------------------------------------',
      ].join('\n');
      addOutput('system', aboutText);
      return;
    }

    // 4. CHALLENGES LIST COMMAND
    if (lowerCmd === 'challenges' || lowerCmd === 'ls') {
      setIsLoading(true);
      try {
        const data = await api.getChallenges();
        const text = [
          'There are 2 challenges. Find the hidden keywords.',
          '',
          `  [1]  Recon    [EASY]    Find the hidden keyword in plain sight.`,
          `  [2]  Decode   [EASY]    Identify the encoding and recover keyword.`,
          '',
          `Progress: ${data.completed_count}/2 completed.`,
          "Type 'challenge 1' or 'challenge 2' to begin.",
        ].join('\n');
        addOutput('system', text);
      } catch (err: any) {
        addOutput('error', `Failed to load challenges: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // 5. CHALLENGE 1
    if (lowerCmd === 'challenge 1') {
      const text = [
        'Some information is hidden in plain sight.',
        'Find the first keyword hidden in this website.',
        '',
        "Hint: Type 'hint 1' if you need a clue.",
        "Submit answer: submit 1 <answer>",
      ].join('\n');
      addOutput('system', text);
      return;
    }

    // 6. CHALLENGE 2
    if (lowerCmd === 'challenge 2') {
      const text = [
        'An intercepted message has been recovered.',
        'Payload: QlJFQUNI',
        'Identify the encoding and recover the keyword.',
        '',
        "Hint: Type 'hint 2' if you need a clue.",
        "Submit answer: submit 2 <answer>",
      ].join('\n');
      addOutput('system', text);
      return;
    }

    // 7. HINT 1
    if (lowerCmd === 'hint 1') {
      const hints = [
        'Hint: The clue is on this website, not inside the terminal.',
        'Hint 2: Inspect the page source and look for an HTML comment.',
      ].join('\n');
      addOutput('hint', hints);
      return;
    }

    // 8. HINT 2
    if (lowerCmd === 'hint 2') {
      const hints = [
        'Hint: The payload is encoded, not encrypted.',
        'Hint 2: Look for a common encoding that uses letters, numbers, plus signs, slashes, and equals signs.',
        'Command: echo QlJFQUNI | base64 -d',
      ].join('\n');
      addOutput('hint', hints);
      return;
    }

    // 9. STATUS COMMAND
    if (lowerCmd === 'status') {
      const c1 = sessionData?.challenge_1_completed;
      const c2 = sessionData?.challenge_2_completed;
      const count = sessionData?.completed_count ?? 0;
      const statusText = [
        'CHALLENGE PROGRESS STATUS:',
        `  [${c1 ? '✓' : ' '}] Challenge 1 (Recon)   : ${c1 ? 'SOLVED' : 'INCOMPLETE'}`,
        `  [${c2 ? '✓' : ' '}] Challenge 2 (Decode)  : ${c2 ? 'SOLVED' : 'INCOMPLETE'}`,
        `  Total: ${count}/2`,
        count === 2
          ? '[+] Registration UNLOCKED! Type register to enroll your team.'
          : '[-] Registration LOCKED. Solve remaining challenge(s).',
      ].join('\n');
      addOutput(count === 2 ? 'success' : 'system', statusText);
      return;
    }

    // 10. REGISTER COMMAND
    if (lowerCmd === 'register') {
      if (sessionData?.registered) {
        addOutput(
          'success',
          `Your team is already enrolled! Registration ID: ${sessionData.registration_code}`
        );
        return;
      }
      if (!sessionData?.is_eligible) {
        const text = [
          'ACCESS DENIED',
          'Complete both challenges before registration can be unlocked.',
          `Current progress: ${sessionData?.completed_count ?? 0}/2 challenges.`,
          "Type 'status' to view your progress.",
        ].join('\n');
        addOutput('error', text);
        return;
      }

      addOutput(
        'success',
        '[+] Verification confirmed. Opening registration terminal...'
      );
      onOpenRegister();
      return;
    }

    // 11. SUBMIT 1 / SUBMIT 2 COMMANDS
    const submitMatch = cmd.match(/^submit\s+([12])\s+(.+)$/i);
    if (submitMatch) {
      const challengeId = parseInt(submitMatch[1], 10);
      const answer = submitMatch[2].trim();

      setIsLoading(true);
      try {
        const res = await api.submitAnswer(challengeId, answer);
        await onRefreshSession();

        if (res.success) {
          addOutput('success', res.message);
          if (res.is_unlocked) {
            onOpenRegister();
          }
        } else {
          addOutput('error', res.message);
        }
      } catch (err: any) {
        addOutput('error', `[!] ${err.message}`);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // 12. SAFE BASE64 SIMULATION PIPELINE: echo <payload> | base64 -d
    const echoMatch = cmd.match(/^echo\s+([A-Za-z0-9+/=]+)\s*\|\s*base64\s+-d\s*$/i);
    if (echoMatch) {
      const encoded = echoMatch[1];
      try {
        const decoded = atob(encoded);
        addOutput('system', decoded);
      } catch {
        addOutput('error', 'base64: invalid input');
      }
      return;
    }

    // 13. ADMIN COMMAND
    if (lowerCmd === 'admin') {
      addOutput('system', 'Opening admin dashboard...');
      onOpenAdmin();
      return;
    }

    // 14. SAFEGUARD: Reject any chaining or piping cleanly
    if (cmd.includes('|') || cmd.includes('&&') || cmd.includes(';') || cmd.includes('>')) {
      addOutput(
        'error',
        "Piping or chaining not supported. Safe simulated command: 'echo <string> | base64 -d'."
      );
      return;
    }

    // 15. UNKNOWN COMMAND FALLBACK
    addOutput(
      'error',
      `Command not found: '${cmd}'. Type 'help' to see available commands.`
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!isLoading) {
        executeCommand(inputVal);
        setInputVal('');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInputVal(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < commandHistory.length) {
          setHistoryIndex(nextIndex);
          setInputVal(commandHistory[nextIndex]);
        } else {
          setHistoryIndex(-1);
          setInputVal('');
        }
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
      className="h-full min-h-0 flex flex-col bg-[#070a0e] p-3 sm:p-4 md:p-5 font-mono text-xs sm:text-sm text-gray-200 select-text overflow-hidden"
    >
      {/* Scrollable Terminal Output Buffer (ONLY this area scrolls internally) */}
      <div
        ref={outputContainerRef}
        className="flex-1 min-h-0 overflow-y-auto space-y-2.5 pr-2 focus:outline-none"
      >
        {history.map((item) => (
          <div key={item.id} className="leading-relaxed">
            {item.type === 'command' && (
              <div className="flex items-center space-x-2 text-gray-300 font-semibold">
                <span className="text-[#00ff66] font-bold select-none">
                  participant@DEFCON:~$
                </span>
                <span className="text-gray-100">{item.content}</span>
              </div>
            )}

            {item.type === 'system' && (
              <pre className="text-gray-300 font-mono whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                {item.content}
              </pre>
            )}

            {item.type === 'hint' && (
              <pre className="text-[#f59e0b] font-mono whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                {item.content}
              </pre>
            )}

            {item.type === 'success' && (
              <pre className="text-[#00ff66] font-bold font-mono whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                {item.content}
              </pre>
            )}

            {item.type === 'error' && (
              <pre className="text-[#ef4444] font-mono whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                {item.content}
              </pre>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-[#00ff66] py-1">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00ff66] animate-ping" />
            <span className="text-xs font-mono text-gray-400">Processing...</span>
          </div>
        )}
      </div>

      {/* Persistent Command Prompt Input Line */}
      <div className="mt-2 pt-2 border-t border-[#1a2330] flex items-center space-x-2 relative shrink-0">
        <span className="text-[#00ff66] font-bold select-none whitespace-nowrap text-xs sm:text-sm">
          participant@DEFCON:~$
        </span>
        <div className="relative flex-1 flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className="w-full bg-transparent border-none outline-none text-white font-mono text-xs sm:text-sm p-0 m-0 caret-transparent focus:ring-0"
          />
          {/* Custom Blinking Block Cursor */}
          <span
            className="absolute pointer-events-none text-[#00ff66] font-bold cursor-blink text-xs sm:text-sm"
            style={{
              left: `${inputVal.length * 0.605}em`,
            }}
          >
            █
          </span>
        </div>
      </div>

      {/* Mobile/Touch Quick Command Chips */}
      <div className="mt-2 pt-1.5 flex items-center flex-wrap gap-1.5 border-t border-[#121922] select-none text-[11px] shrink-0">
        <button
          type="button"
          onClick={() => executeCommand('help')}
          className="px-2 py-0.5 rounded bg-[#131b24] hover:bg-[#1d2735] text-gray-300 hover:text-white border border-[#232f3f] transition-colors"
        >
          help
        </button>
        <button
          type="button"
          onClick={() => executeCommand('challenges')}
          className="px-2 py-0.5 rounded bg-[#131b24] hover:bg-[#1d2735] text-[#00ff66] border border-[#232f3f] transition-colors"
        >
          challenges
        </button>
        <button
          type="button"
          onClick={() => executeCommand('status')}
          className="px-2 py-0.5 rounded bg-[#131b24] hover:bg-[#1d2735] text-gray-300 hover:text-white border border-[#232f3f] transition-colors"
        >
          status
        </button>
        <button
          type="button"
          onClick={() => executeCommand('hint 1')}
          className="px-2 py-0.5 rounded bg-[#131b24] hover:bg-[#1d2735] text-[#f59e0b] border border-[#232f3f] transition-colors"
        >
          hint 1
        </button>
        <button
          type="button"
          onClick={() => executeCommand('hint 2')}
          className="px-2 py-0.5 rounded bg-[#131b24] hover:bg-[#1d2735] text-[#f59e0b] border border-[#232f3f] transition-colors"
        >
          hint 2
        </button>
        <button
          type="button"
          onClick={() => executeCommand('echo QlJFQUNI | base64 -d')}
          className="px-2 py-0.5 rounded bg-[#131b24] hover:bg-[#1d2735] text-gray-300 hover:text-white border border-[#232f3f] transition-colors"
        >
          decode
        </button>
        <button
          type="button"
          onClick={() => executeCommand('register')}
          className="px-2 py-0.5 rounded bg-[#00ff66]/10 hover:bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/30 transition-colors font-bold ml-auto"
        >
          register
        </button>
      </div>
    </div>
  );
};
