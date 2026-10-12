export interface EventInfo {
  name: string;
  format: string;
  duration: string;
  mode: string;
  venue: string;
  date: string;
}

export interface SessionData {
  session_token: string;
  challenge_1_completed: boolean;
  challenge_2_completed: boolean;
  completed_count: number;
  is_eligible: boolean;
  registered: boolean;
  registration_code?: string;
  event_info: EventInfo;
}

export interface Challenge {
  id: number;
  title: string;
  difficulty: string;
  description: string;
  hints: string[];
  completed: boolean;
}

export interface ChallengesResponse {
  challenges: Challenge[];
  completed_count: number;
  total_challenges: number;
}

export interface SubmitAnswerResponse {
  success: boolean;
  message: string;
  challenge_id: number;
  completed_count: number;
  total_challenges: number;
  is_unlocked: boolean;
  detail?: string;
}

export interface RegistrationFormData {
  team_name: string;
  institution: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  team_size: number;
  members: string[];
  agreed_to_rules: boolean;
}

export interface RegistrationResult {
  success: boolean;
  registration_code: string;
  team_name: string;
  institution: string;
  leader_name: string;
  team_size: number;
  members: string[];
  created_at: string;
  message: string;
}

export interface TerminalOutputItem {
  id: string;
  type: 'command' | 'success' | 'error' | 'hint' | 'system' | 'ascii' | 'progress';
  content: string;
  command?: string;
  timestamp?: string;
}

export interface AdminRegistrationItem {
  id: number;
  registration_code: string;
  team_name: string;
  institution: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  team_size: number;
  members: string[];
  created_at: string;
}

export interface AdminStats {
  total_registrations: number;
  total_participants: number;
  completed_challenges_sessions: number;
  teams_1_person: number;
  teams_2_person: number;
  teams_3_person: number;
  teams_4_person: number;
}
