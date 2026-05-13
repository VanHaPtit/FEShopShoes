import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '../types/chat';

export type MessageCallback = (msg: ChatMessage) => void;

class ChatSocketService {
  private client: Client | null = null;
  private connected = false;

  public connect(token: string, onConnect: () => void, onError: (err: any) => void) {
    if (this.connected) return;

    // Thay đổi URL theo BE thực tế của bạn
    const socketUrl = `http://${window.location.hostname}:8080/ws`;

    this.client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => {
        // console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      this.connected = true;
      onConnect();
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      onError(frame);
    };

    this.client.onWebSocketError = (event) => {
      console.error('WebSocket Error', event);
      onError(event);
    };

    this.client.activate();
  }

  public disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
    }
  }

  // KHÁCH HÀNG: Đăng ký nhận tin nhắn của mình
  public subscribeUser(userId: number, callback: MessageCallback) {
    if (!this.client || !this.connected) return;
    this.client.subscribe(`/topic/user/${userId}`, (message) => {
      if (message.body) {
        callback(JSON.parse(message.body));
      }
    });
  }

  // ADMIN: Đăng ký nhận toàn bộ tin nhắn
  public subscribeAdmin(callback: MessageCallback) {
    if (!this.client || !this.connected) return;
    this.client.subscribe(`/topic/admin/chat`, (message) => {
      if (message.body) {
        callback(JSON.parse(message.body));
      }
    });
  }

  // KHÁCH HÀNG: Gửi câu hỏi
  public sendMessage(content: string) {
    if (!this.client || !this.connected) return;
    this.client.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({ content })
    });
  }

  // ADMIN: Trả lời khách
  public replyToUser(targetUserId: number, content: string) {
    if (!this.client || !this.connected) return;
    this.client.publish({
      destination: '/app/chat.reply',
      body: JSON.stringify({ targetUserId, content })
    });
  }
  
  public isConnected() {
    return this.connected;
  }
}

export const chatSocket = new ChatSocketService();
