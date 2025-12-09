import { Message } from '../../domain/entity/Message';
import User from '../../domain/entity/User';

export interface MessageRepository {
  save(message: Message): Promise<void>;
  list(fromUser: User, toUser: User): Promise<Message[]>;
  findConversationsByUserId(userId: string): Promise<Message[]>;
}
