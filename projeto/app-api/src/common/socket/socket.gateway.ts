import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/crawler',
})
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  // Ao conectar, associar o userId ao socket através de uma sala/room
  async handleConnection(socket: Socket) {
    const token = socket.handshake.headers.authorization?.split(' ')[1];

    if (token) {
      try {
        // Verifica o JWT e extrai o userId
        const payload = this.jwtService.verify(token);
        const userId = payload.userId;

        // Adiciona o socket à sala correspondente ao userId
        socket.join(`user_${userId}`);

        console.log(`Usuário ${userId} conectado, socket ID: ${socket.id}`);
      } catch (error) {
        console.log('Conexão não autorizada:', error);
        socket.disconnect();
      }
    } else {
      socket.disconnect(); // Desconecta se não houver token
    }
  }

  // Ao desconectar, remover o socket da sala
  async handleDisconnect(socket: Socket) {
    console.log(`Socket desconectado, ID: ${socket.id}`);
  }

  // TODO DTO
  async sendMessage(userId: number, message: string, data : string | object | number) : Promise<void> {
    this.server.to(`user_${userId}`).emit(message, data);
  }
}