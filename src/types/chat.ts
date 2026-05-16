export interface ChatMessage {
  id?: number | string;
  senderId?: number; // Có thể null nếu là AI hoặc Guest chưa đăng nhập
  senderName?: string;
  senderRole?: 'USER' | 'ADMIN' | 'AI';
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
