import { create } from 'zustand';
import { ChatState, ChatMessage, ChatSession } from '../types/chat';
import { chatSocket } from '../websocket/chatSocket';
import { ChatApi } from '../api/chatApi';

export const useChat = create<ChatState>((set, get) => ({
  messages: [],
  activeSessions: [],
  currentSessionId: null,
  isConnected: false,
  isAiEnabled: true,

  addMessage: (msg) => set((state) => {
    // Không thêm trùng id (nếu có id)
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

// Helper functions để component gọi
export const connectChat = (token: string, userId: number, role: 'USER' | 'ADMIN') => {
  const { setConnectionStatus, addMessage, setMessages } = useChat.getState();

  // 1. Tải lịch sử chat
  ChatApi.getChatHistory(role === 'ADMIN' ? undefined : undefined).then(history => {
    setMessages(history);
  }).catch(err => {
    console.error("Lỗi tải lịch sử chat:", err);
  });

  // 2. Kết nối WebSocket
  chatSocket.connect(
    token,
    () => {
      setConnectionStatus(true);
      if (role === 'ADMIN') {
        chatSocket.subscribeAdmin((msg) => {
          // Với Admin, lưu message và cập nhật danh sách session
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
  // (Tuỳ chọn) Thêm message tạm thời vào UI trước khi BE trả về
};

export const replyToUser = (targetUserId: number, content: string) => {
  chatSocket.replyToUser(targetUserId, content);
};
