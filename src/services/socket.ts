import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NODE_ENV === 'production' 
  ? window.location.origin 
  : 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
       this.socket = io(SOCKET_URL);
    }
    return this.socket;
  }

  getSocket() {
    if (!this.socket) {
      return this.connect();
    }
    return this.socket;
  }
}

export const socketService = new SocketService();
export const socket = socketService.getSocket();
