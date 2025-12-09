import HTTPServer from '../http/HTTPServer';
import ListConversations from '../../application/use-case/ListConversations';
import { authMiddleware } from '../http/middleware/PassportMiddleware';

export default class MessageController {
  constructor(
    private readonly httpServer: HTTPServer,
    private readonly listConversations: ListConversations,
  ) {}

  registerRoutes(): void {
    this.httpServer.route(
      'get',
      '/conversations',
      async (params: unknown, body: unknown, query: unknown, context: { userId: string }) => {
        const conversations = await this.listConversations.execute(context.userId);
        return { response: conversations, statusCode: 200 };
      },
      [authMiddleware],
    );
  }
}
