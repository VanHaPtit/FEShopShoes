import { create } from 'zustand';
import { ChatState, ChatMessage, ChatSession } from '../types/chat';
import { chatSocket } from '../services/chatSocket';
import { ChatApi } from '../api/chatApi';

export const useChat = create<ChatState>((set, get) => ({
  messages: [],
  activeSessions: [],
  currentSessionId: null,
  isConnected: false,
  isAiEnabled: true,

  addMessage: (msg) => set((state) => {
    if (msg.id && state.messages.find(m => m.id === msg.id)) {
      return state;
    }
    return { messages: [...state.messages, msg] };
  }),

  setMessages: (messages) => set({ messages }),
  
  setSessions: (sessions) => set({ activeSessions: sessions }),
  
  setCurrentSession: (userId) => set({ currentSessionId: userId }),
  
  setConnectionStatus: (status) => set({ isConnected: status }),
  
  setAiStatus: (status) => set({ isAiEnabled: status })
}));

export const connectChat = (token: string, userId: number, role: 'USER' | 'ADMIN') => {
  const { setConnectionStatus, addMessage, setMessages } = useChat.getState();

  ChatApi.getChatHistory(role === 'ADMIN' ? undefined : undefined).then(history => {
    setMessages(history);
  });

  chatSocket.connect(
    token,
    () => {
      setConnectionStatus(true);
      if (role === 'ADMIN') {
        chatSocket.subscribeAdmin((msg) => {
          addMessage(msg);
        });
      } else {
        chatSocket.subscribeUser(userId, (msg) => {
          addMessage(msg);
        });
      }
    },
    (err) => {
      setConnectionStatus(false);
      console.error("Chat disconnected", err);
    }
  );
};

export const disconnectChat = () => {
  chatSocket.disconnect();
  useChat.getState().setConnectionStatus(false);
};

export const sendMessage = (content: string) => {
  chatSocket.sendMessage(content);
};

export const replyToUser = (targetUserId: number, content: string) => {
  chatSocket.replyToUser(targetUserId, content);
};
