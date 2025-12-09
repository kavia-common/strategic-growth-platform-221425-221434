export interface Org {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Membership {
  id: string;
  user_id: string;
  org_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
  org?: Org;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  default_org_id?: string;
}

export interface Conversation {
  id: string;
  org_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface Metric {
  id: string;
  org_id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  period: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
