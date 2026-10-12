import React, { useState } from 'react';
import { X, ShieldCheck, AlertCircle, ChevronRight } from 'lucide-react';
import type { RegistrationFormData, RegistrationResult } from '../types';
import { api } from '../services/api';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: RegistrationResult) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    team_name: '',
    institution: '',
    leader_name: '',
    leader_email: '',
    leader_phone: '',
    team_size: 2,
    members: [''],
    agreed_to_rules: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTeamSizeChange = (newSize: number) => {
    const requiredAdditional = newSize - 1;
    const currentMembers = [...formData.members];
    let updatedMembers: string[] = [];

    for (let i = 0; i < requiredAdditional; i++) {
      updatedMembers.push(currentMembers[i] || '');
    }

    setFormData({
      ...formData,
      team_size: newSize,
      members: updatedMembers,
    });
  };

  const handleMemberChange = (index: number, val: string) => {
    const nextMembers = [...formData.members];
    nextMembers[index] = val;
    setFormData({ ...formData, members: nextMembers });
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.team_name.trim()) {
      errors.team_name = 'Team name is required';
    } else if (formData.team_name.trim().length < 2) {
      errors.team_name = 'Team name must be at least 2 characters';
    }

    if (!formData.institution.trim()) {
      errors.institution = 'Institution / College is required';
    }

    if (!formData.leader_name.trim()) {
      errors.leader_name = 'Team leader name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.leader_email.trim()) {
      errors.leader_email = 'Leader email is required';
    } else if (!emailRegex.test(formData.leader_email.trim())) {
      errors.leader_email = 'Valid email address is required';
    }

    const phoneClean = formData.leader_phone.replace(/[\s\-\(\)\+]/g, '');
    if (!formData.leader_phone.trim()) {
      errors.leader_phone = 'Phone number is required';
    } else if (phoneClean.length < 7 || phoneClean.length > 15 || !/^\d+$/.test(phoneClean)) {
      errors.leader_phone = 'Phone number must be between 7 and 15 digits';
    }

    // Validate additional members
    formData.members.forEach((m, idx) => {
      if (!m.trim()) {
        errors[`member_${idx}`] = `Member ${idx + 2} full name is required`;
      }
    });

    if (!formData.agreed_to_rules) {
      errors.agreed_to_rules = 'You must agree to event rules and guidelines';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload: RegistrationFormData = {
        ...formData,
        team_name: formData.team_name.trim(),
        institution: formData.institution.trim(),
        leader_name: formData.leader_name.trim(),
        leader_email: formData.leader_email.trim().toLowerCase(),
        leader_phone: formData.leader_phone.trim(),
        members: formData.members.map((m) => m.trim()),
      };

      const result = await api.registerTeam(payload);
      onSuccess(result);
    } catch (err: any) {
      setApiError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0b0f14] border border-[#1f2937] rounded-lg shadow-2xl text-xs sm:text-sm font-mono overflow-hidden my-6">
        {/* Terminal Header */}
        <div className="bg-[#121820] border-b border-[#1f2937] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="font-bold text-gray-200 tracking-wider">
              DEFCON 2.0 // TEAM REGISTRATION PROTOCOL
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Security Clearance Banner */}
        <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2 flex items-center justify-between text-[11px] text-emerald-300">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>CHALLENGE VERIFICATION: COMPLETE (2/2 SOLVED)</span>
          </div>
          <span className="text-gray-400 hidden sm:inline">AUTH: GRANTED</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {apiError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Team & Institution Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">
                TEAM NAME <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.team_name}
                onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                placeholder="e.g. ZeroDay Knights"
                className={`w-full bg-[#070a0e] border ${
                  formErrors.team_name ? 'border-red-500' : 'border-[#232f3f] focus:border-emerald-400'
                } rounded px-3 py-2 text-white outline-none font-mono text-xs transition-colors`}
              />
              {formErrors.team_name && (
                <p className="text-[10px] text-red-400 mt-1">{formErrors.team_name}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] text-gray-400 mb-1">
                INSTITUTION / COLLEGE <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="e.g. NIT Warangal"
                className={`w-full bg-[#070a0e] border ${
                  formErrors.institution ? 'border-red-500' : 'border-[#232f3f] focus:border-emerald-400'
                } rounded px-3 py-2 text-white outline-none font-mono text-xs transition-colors`}
              />
              {formErrors.institution && (
                <p className="text-[10px] text-red-400 mt-1">{formErrors.institution}</p>
              )}
            </div>
          </div>

          {/* Team Leader Contact */}
          <div className="space-y-3 pt-1 border-t border-[#1a2330]">
            <div className="text-[11px] font-bold text-gray-300 flex items-center gap-1.5">
              <span>TEAM LEADER PARTICIPANT DETAILS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">
                  FULL NAME <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.leader_name}
                  onChange={(e) => setFormData({ ...formData, leader_name: e.target.value })}
                  placeholder="Leader Name"
                  className={`w-full bg-[#070a0e] border ${
                    formErrors.leader_name ? 'border-red-500' : 'border-[#232f3f] focus:border-emerald-400'
                  } rounded px-3 py-2 text-white outline-none font-mono text-xs transition-colors`}
                />
                {formErrors.leader_name && (
                  <p className="text-[10px] text-red-400 mt-1">{formErrors.leader_name}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">
                  EMAIL ADDRESS <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={formData.leader_email}
                  onChange={(e) => setFormData({ ...formData, leader_email: e.target.value })}
                  placeholder="leader@college.edu"
                  className={`w-full bg-[#070a0e] border ${
                    formErrors.leader_email ? 'border-red-500' : 'border-[#232f3f] focus:border-emerald-400'
                  } rounded px-3 py-2 text-white outline-none font-mono text-xs transition-colors`}
                />
                {formErrors.leader_email && (
                  <p className="text-[10px] text-red-400 mt-1">{formErrors.leader_email}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 mb-1">
                  PHONE NUMBER <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.leader_phone}
                  onChange={(e) => setFormData({ ...formData, leader_phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className={`w-full bg-[#070a0e] border ${
                    formErrors.leader_phone ? 'border-red-500' : 'border-[#232f3f] focus:border-emerald-400'
                  } rounded px-3 py-2 text-white outline-none font-mono text-xs transition-colors`}
                />
                {formErrors.leader_phone && (
                  <p className="text-[10px] text-red-400 mt-1">{formErrors.leader_phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Team Size Selector (1 to 4) */}
          <div className="pt-2 border-t border-[#1a2330]">
            <label className="block text-[11px] text-gray-400 mb-2">
              TEAM SIZE (1 TO 4 PARTICIPANTS) <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleTeamSizeChange(size)}
                  className={`py-2 px-2 rounded border text-center text-xs font-bold transition-all ${
                    formData.team_size === size
                      ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                      : 'border-[#232f3f] bg-[#070a0e] text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {size} {size === 1 ? 'Solo' : 'Members'}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Additional Member Fields */}
          {formData.team_size > 1 && (
            <div className="space-y-2.5 pt-2 border-t border-[#1a2330]">
              <div className="text-[11px] font-bold text-gray-300">
                ADDITIONAL SQUAD MEMBERS ({formData.team_size - 1} required)
              </div>
              <div className="space-y-2">
                {formData.members.map((member, idx) => (
                  <div key={idx}>
                    <label className="block text-[10px] text-gray-400 mb-1">
                      MEMBER {idx + 2} FULL NAME <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={member}
                      onChange={(e) => handleMemberChange(idx, e.target.value)}
                      placeholder={`Full name of Member ${idx + 2}`}
                      className={`w-full bg-[#070a0e] border ${
                        formErrors[`member_${idx}`]
                          ? 'border-red-500'
                          : 'border-[#232f3f] focus:border-emerald-400'
                      } rounded px-3 py-2 text-white outline-none font-mono text-xs transition-colors`}
                    />
                    {formErrors[`member_${idx}`] && (
                      <p className="text-[10px] text-red-400 mt-0.5">
                        {formErrors[`member_${idx}`]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules Checkbox */}
          <div className="pt-2 border-t border-[#1a2330]">
            <label className="flex items-start space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreed_to_rules}
                onChange={(e) => setFormData({ ...formData, agreed_to_rules: e.target.checked })}
                className="mt-0.5 rounded border-[#232f3f] bg-[#070a0e] text-emerald-500 focus:ring-0 w-4 h-4"
              />
              <span className="text-[11px] text-gray-300 leading-tight">
                I agree to the DEFCON 2.0 Competition Rules, Attack-Defense Code of Ethics, and
                confirm all submitted information is authentic.
              </span>
            </label>
            {formErrors.agreed_to_rules && (
              <p className="text-[10px] text-red-400 mt-1">{formErrors.agreed_to_rules}</p>
            )}
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-[#1a2330] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded border border-[#232f3f] text-gray-400 hover:text-white hover:bg-[#16202c] transition-colors"
            >
              Abort
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold tracking-wider flex items-center space-x-1.5 transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3 h-3 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  <span>TRANSMITTING...</span>
                </>
              ) : (
                <>
                  <span>TRANSMIT REGISTRATION</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
