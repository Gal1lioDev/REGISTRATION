import type {
  SessionData,
  ChallengesResponse,
  SubmitAnswerResponse,
  RegistrationFormData,
  RegistrationResult,
  AdminRegistrationItem,
  AdminStats,
} from '../types';

const API_BASE = '/api';

export const api = {
  async getSession(): Promise<SessionData> {
    const res = await fetch(`${API_BASE}/session`, {
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error(`Failed to initialize session: ${res.statusText}`);
    }
    return res.json();
  },

  async getChallenges(): Promise<ChallengesResponse> {
    const res = await fetch(`${API_BASE}/challenges`, {
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error(`Failed to load challenges: ${res.statusText}`);
    }
    return res.json();
  },

  async submitAnswer(challengeId: number, answer: string): Promise<SubmitAnswerResponse> {
    const res = await fetch(`${API_BASE}/challenges/${challengeId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ answer }),
    });

    if (res.status === 429) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Rate limit exceeded. Please wait before retrying.');
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Submission failed with status ${res.status}`);
    }

    return res.json();
  },

  async registerTeam(data: RegistrationFormData): Promise<RegistrationResult> {
    const res = await fetch(`${API_BASE}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Registration failed (${res.status})`);
    }

    return res.json();
  },

  async adminLogin(username: string, password: string): Promise<{ success: boolean; username: string }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Invalid administrative credentials');
    }

    return res.json();
  },

  async adminLogout(): Promise<void> {
    await fetch(`${API_BASE}/admin/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  },

  async checkAdminAuth(): Promise<{ authenticated: boolean; username?: string }> {
    try {
      const res = await fetch(`${API_BASE}/admin/me`, {
        credentials: 'include',
      });
      if (res.ok) {
        return res.json();
      }
      return { authenticated: false };
    } catch {
      return { authenticated: false };
    }
  },

  async getAdminRegistrations(q?: string): Promise<{ items: AdminRegistrationItem[]; stats: AdminStats }> {
    const url = q ? `${API_BASE}/admin/registrations?q=${encodeURIComponent(q)}` : `${API_BASE}/admin/registrations`;
    const res = await fetch(url, {
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Unauthorized or failed to fetch registrations');
    }

    return res.json();
  },

  getExportCsvUrl(): string {
    return `${API_BASE}/admin/registrations/export`;
  },
};
