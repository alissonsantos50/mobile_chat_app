import { MessageRepository } from '../../infra/repository/MessageRepository';
import UserRepository from '../../infra/repository/UserRepository';

export default class ListConversations {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string): Promise<ListConversationsOutput | undefined> {
    const user = await this.userRepository.getByPublicId(userId);
    if (!user || !user.id) throw new Error('Usuário não encontrado');

    const lastMessages = await this.messageRepository.findConversationsByUserId(
      user.id,
    );
    const conversations = await Promise.all(
      lastMessages.map(async (message) => {
        const partnerId = message.from === userId ? message.to : message.from;
        const partner = await this.userRepository.getByPublicId(partnerId);
        return {
          partner: {
            id: partner?.id,
            publicId: partner?.publicId,
            name: partner?.name,
          },
          lastMessage: {
            id: message.id,
            publicId: message.publicId,
            text: message.text,
            createdAt: message.createdAt,
          },
        };
      }),
    );
    return conversations.filter(
      (conv) =>
        conv.partner.id !== undefined && conv.partner.name !== undefined,
    ) as ListConversationsOutput;
  }
}

type ListConversationsOutput = {
  partner: {
    id: string;
    publicId: string;
    name: string;
  };
  lastMessage: {
    id: string;
    publicId: string;
    text: string;
    createdAt: Date;
  };
}[];
