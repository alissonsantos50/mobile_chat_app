import { Message } from '../../domain/entity/Message';
import User from '../../domain/entity/User';
import { MessageRepository } from './MessageRepository';

export default class MessageRepositoryMemory implements MessageRepository {
  private messages: Message[] = [];

  async save(message: Message): Promise<void> {
    this.messages.push(message);
  }

  async list(from: User, to: User): Promise<Message[]> {
    return this.messages.filter(
      (msg) =>
        (msg.from === from.publicId && msg.to === to.publicId) ||
        (msg.from === to.publicId && msg.to === from.publicId),
    );
  }

  async findConversationsByUserId(userId: string): Promise<Message[]> {
    const userMessages = this.messages.filter(
      (msg) => msg.from === userId || msg.to === userId,
    );

    const conversations: { [partnerId: string]: Message } = {};
    for (const message of userMessages) {
      const partnerId = message.from === userId ? message.to : message.from;
      if (
        !conversations[partnerId] ||
        message.createdAt.getTime() >
          conversations[partnerId].createdAt.getTime()
      ) {
        conversations[partnerId] = message;
      }
    }
    return Object.values(conversations);
  }
}
