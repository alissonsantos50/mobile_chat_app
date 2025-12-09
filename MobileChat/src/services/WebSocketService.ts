import { io, Socket } from 'socket.io-client';
import { getApiBaseUrl } from './api';

class WebSocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket) return;

    this.socket = io(getApiBaseUrl(), {
      auth: {
        token,
      },
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      this.socket = null;
    });

    this.socket.on('connect_error', err => {
      console.error('WebSocket connection error:', err.message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  emit(event: string, ...args: any[]) {
    if (this.socket) {
      this.socket.emit(event, ...args);
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const webSocketService = new WebSocketService();
export type { WebSocketService };
