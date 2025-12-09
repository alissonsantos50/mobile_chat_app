import { Server, Socket } from 'socket.io';
import { MessageRepository } from '../repository/MessageRepository';
import { Message } from '../../domain/entity/Message';
import UserRepository from '../repository/UserRepository';
import jwt from 'jsonwebtoken';

interface SocketWithAuth extends Socket {
  userId?: string;
  userName?: string;
}

export class ChatGateway {
  private connectedUsers: Map<string, string> = new Map();

  constructor(
    private readonly io: Server,
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
  ) {
    this.io.use((socket: SocketWithAuth, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'secret',
        ) as {
          userId: string;
          name: string;
        };
        socket.userId = decoded.userId;
        socket.userName = decoded.name;
        next();
      } catch (err) {
        return next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket: SocketWithAuth) => {
      const userId = socket.userId;
      if (userId) {
        this.connectedUsers.set(userId, socket.id);
        this.updateUserList();
      }

      socket.on('send-message', async (data) => {
        const fromId = socket.userId;
        const toId = data.recipientId;
        const { text } = data;

        if (!fromId || !toId || !text) return;

        const [fromUser, toUser] = await Promise.all([
          this.userRepository.getByPublicId(fromId),
          this.userRepository.getByPublicId(toId),
        ]);

        if (!fromUser || !toUser) {
          return;
        }

        const message = Message.create(fromUser.id!, toUser.id!, text);
        await this.messageRepository.save(message);

        const messageForClient = {
          id: message.publicId,
          text: message.text,
          createdAt: message.createdAt,
          user: {
            id: fromUser.publicId,
            name: fromUser.name,
          },
        };

        const toSocketId = this.connectedUsers.get(toUser.publicId);
        if (toSocketId) {
          this.io.to(toSocketId).emit('new-message', messageForClient);
        }
        socket.emit('new-message', messageForClient);
      });

      socket.on('get-message-history', async (data) => {
        const userId = socket.userId;
        const withUserId = data.withUserId;

        if (!userId || !withUserId) return;

        const [user, withUser] = await Promise.all([
          this.userRepository.getByPublicId(userId || ''),
          this.userRepository.getByPublicId(withUserId || ''),
        ]);

        if (!user || !withUser) return;

        const history = await this.messageRepository.list(user, withUser);
        const formattedHistory = history.map((message) => ({
          _id: message.id,
          text: message.text,
          createdAt: message.createdAt,
          user: {
            _id: message.from,
          },
        }));
        socket.emit('message-history', formattedHistory);
      });

      socket.on('get-user-list', async () => {
        const users = await this.userRepository.listAll();
        if (!users) return;
        socket.emit(
          'user-list',
          users.map((user) => ({
            id: user.publicId,
            name: user.name,
            online: this.connectedUsers.has(user.publicId),
          })),
        );
      });

      socket.on('disconnect', () => {
        if (userId) {
          this.connectedUsers.delete(userId);
          this.updateUserList();
        }
      });
    });
  }

  async updateUserList() {
    const users = await this.userRepository.listAll();
    if (!users) return;
    this.io.emit(
      'user-list',
      users.map((user) => ({
        id: user.publicId,
        name: user.name,
        online: this.connectedUsers.has(user.publicId),
      })),
    );
  }
}
