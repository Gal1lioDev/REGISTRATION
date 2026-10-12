import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  LogOut,
  Download,
  Search,
  Shield,
  Eye,
  RefreshCw,
} from 'lucide-react';
import type { AdminRegistrationItem, AdminStats } from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [registrations, setRegistrations] = useState<AdminRegistrationItem[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [selectedReg, setSelectedReg] = useState<AdminRegistrationItem | null>(null);

  useEffect(() => {
    if (isOpen) {
      checkAuthAndFetch();
    }
  }, [isOpen]);

  const checkAuthAndFetch = async () => {
    try {
      const auth = await api.checkAdminAuth();
      if (auth.authenticated) {
        setIsAuthenticated(true);
        fetchRegistrations();
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const fetchRegistrations = async (term = searchQuery) => {
    setIsLoadingData(true);
    try {
      const data = await api.getAdminRegistrations(term);
      setRegistrations(data.items);
      setStats(data.stats);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      await api.adminLogin(usernameInput, passwordInput);
      setIsAuthenticated(true);
      fetchRegistrations();
    } catch (err: any) {
      setLoginError(err.message || 'Invalid administrative credentials');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await api.adminLogout();
    setIsAuthenticated(false);
    setRegistrations([]);
    setStats(null);
    setUsernameInput('');
    setPasswordInput('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRegistrations(searchQuery);
  };

  const handleExportCsv = () => {
    window.open(api.getExportCsvUrl(), '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#090d12] border border-[#1f2937] rounded-lg shadow-2xl text-xs font-mono overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Title Bar */}
        <div className="bg-[#121820] border-b border-[#1f2937] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-red-400">
            <Shield className="w-4 h-4" />
            <span className="font-bold tracking-wider text-xs sm:text-sm text-gray-200">
              DEFCON 2.0 // MISSION CONTROL ADMIN DASHBOARD
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-[#1c2430] hover:bg-red-500/20 text-gray-300 hover:text-red-400 border border-gray-700 transition-colors"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="text-[11px]">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Not Logged In View */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center max-w-md mx-auto w-full">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white mb-1">
              Restricted Administrative Access
            </h3>
            <p className="text-xs text-gray-400 text-center mb-6">
              Authentication is required to view registered teams and manage tournament rosters.
            </p>

            {loginError && (
              <div className="w-full mb-4 p-2.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-3.5">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">USERNAME</label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full bg-[#05080c] border border-[#232f3f] focus:border-red-400 rounded px-3 py-2 text-white outline-none font-mono text-xs transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">PASSWORD</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#05080c] border border-[#232f3f] focus:border-red-400 rounded px-3 py-2 text-white outline-none font-mono text-xs transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-2.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold tracking-wider uppercase transition-colors shadow-[0_0_12px_rgba(239,68,68,0.3)] mt-2"
              >
                {isLoggingIn ? 'AUTHENTICATING...' : 'AUTHORIZE ADMIN SESSION'}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-5 space-y-4">
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#0d131a] rounded border border-[#1f2937]">
                  <span className="text-[10px] text-gray-500 block uppercase">Total Teams</span>
                  <span className="text-xl font-bold text-emerald-400">
                    {stats.total_registrations}
                  </span>
                </div>
                <div className="p-3 bg-[#0d131a] rounded border border-[#1f2937]">
                  <span className="text-[10px] text-gray-500 block uppercase">Total Participants</span>
                  <span className="text-xl font-bold text-blue-400">
                    {stats.total_participants}
                  </span>
                </div>
                <div className="p-3 bg-[#0d131a] rounded border border-[#1f2937]">
                  <span className="text-[10px] text-gray-500 block uppercase">Challenges Solved</span>
                  <span className="text-xl font-bold text-amber-400">
                    {stats.completed_challenges_sessions}
                  </span>
                </div>
                <div className="p-3 bg-[#0d131a] rounded border border-[#1f2937]">
                  <span className="text-[10px] text-gray-500 block uppercase">Team Distribution</span>
                  <span className="text-xs text-gray-300 block font-mono">
                    1p:{stats.teams_1_person} | 2p:{stats.teams_2_person} | 3p:{stats.teams_3_person} | 4p:{stats.teams_4_person}
                  </span>
                </div>
              </div>
            )}

            {/* Action Toolbar: Search & Export */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5 flex-1 max-w-md">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by team, institution, email, code..."
                    className="w-full pl-8 pr-3 py-1.5 bg-[#05080c] border border-[#232f3f] focus:border-emerald-400 rounded text-xs text-white outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-[#182330] hover:bg-[#233346] text-gray-200 border border-[#2a3a4d] transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    fetchRegistrations('');
                  }}
                  className="p-1.5 rounded bg-[#182330] hover:bg-[#233346] text-gray-400 hover:text-white border border-[#2a3a4d] transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </form>

              <button
                onClick={handleExportCsv}
                className="flex items-center justify-center space-x-1.5 px-3.5 py-1.5 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 transition-colors font-bold whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Registrations Table */}
            <div className="flex-1 overflow-x-auto overflow-y-auto border border-[#1f2937] rounded bg-[#070b0f]">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#101620] border-b border-[#1f2937] text-gray-400 text-[11px] uppercase tracking-wider">
                    <th className="py-2 px-3">Reg ID</th>
                    <th className="py-2 px-3">Team Name</th>
                    <th className="py-2 px-3">Institution</th>
                    <th className="py-2 px-3">Leader</th>
                    <th className="py-2 px-3">Size</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#16212e] text-gray-300 text-xs">
                  {isLoadingData ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        Querying tournament database...
                      </td>
                    </tr>
                  ) : registrations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-500">
                        No registrations found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-[#0d141d] transition-colors">
                        <td className="py-2.5 px-3 font-bold text-emerald-400">
                          {reg.registration_code}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-white">
                          {reg.team_name}
                        </td>
                        <td className="py-2.5 px-3 text-gray-400 max-w-xs truncate">
                          {reg.institution}
                        </td>
                        <td className="py-2.5 px-3 text-gray-300">
                          <div>{reg.leader_name}</div>
                          <div className="text-[10px] text-gray-500">{reg.leader_email}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-[#16212e] text-gray-300 text-[10px] border border-[#233143]">
                            {reg.team_size}p
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-gray-500">
                          {new Date(reg.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => setSelectedReg(reg)}
                            className="p-1 rounded bg-[#182330] hover:bg-[#233346] text-gray-300 hover:text-white border border-[#2a3a4d] transition-colors"
                            title="View Full Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Registration Details Sub-Modal */}
        {selectedReg && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-[#0c1218] border border-[#223143] rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#1f2937] pb-2">
                <span className="font-bold text-emerald-400 text-sm">
                  {selectedReg.registration_code} // TEAM DETAILS
                </span>
                <button
                  onClick={() => setSelectedReg(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px]">TEAM NAME</span>
                  <span className="text-white font-bold text-sm">{selectedReg.team_name}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">INSTITUTION</span>
                  <span className="text-gray-300">{selectedReg.institution}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#182230]">
                  <div>
                    <span className="text-gray-500 block text-[10px]">LEADER NAME</span>
                    <span className="text-gray-200">{selectedReg.leader_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">LEADER PHONE</span>
                    <span className="text-gray-200">{selectedReg.leader_phone}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">LEADER EMAIL</span>
                  <span className="text-gray-200">{selectedReg.leader_email}</span>
                </div>
                <div className="pt-1 border-t border-[#182230]">
                  <span className="text-gray-500 block text-[10px] mb-1">
                    SQUAD MEMBERS ({selectedReg.team_size} TOTAL)
                  </span>
                  <div className="space-y-1">
                    <div className="px-2.5 py-1 rounded bg-[#070a0e] text-emerald-300 border border-[#1b2533]">
                      Leader: {selectedReg.leader_name}
                    </div>
                    {selectedReg.members.map((m, idx) => (
                      <div
                        key={idx}
                        className="px-2.5 py-1 rounded bg-[#070a0e] text-gray-300 border border-[#1b2533]"
                      >
                        Member {idx + 2}: {m}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedReg(null)}
                className="w-full py-2 rounded bg-[#182330] hover:bg-[#233346] text-white font-bold transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
