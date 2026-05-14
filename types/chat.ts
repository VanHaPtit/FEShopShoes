export interface ChatMessage {
  id?: number | string;
  userId?: number; // Thay cho senderId, map đúng với backend
  sender?: 'USER' | 'ADMIN' | 'AI'; // Backend trả về sender
  content: string;
  timestamp?: string;
  isRead?: boolean;
}

export interface ChatSession {
  userId: number;
  userName: string;
  lastMessage: string;
  unreadCount: number;
  updatedAt: string;
}

export interface ChatState {
  messages: ChatMessage[];
  activeSessions: ChatSession[];
  currentSessionId: number | null;
  isConnected: boolean;
  isAiEnabled: boolean;
  addMessage: (msg: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setSessions: (sessions: ChatSession[]) => void;
  setCurrentSession: (userId: number | null) => void;
  setConnectionStatus: (status: boolean) => void;
  setAiStatus: (status: boolean) => void;
}
