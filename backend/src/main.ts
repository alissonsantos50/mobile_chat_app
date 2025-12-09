import 'dotenv/config';
import { Server } from 'socket.io';
import AuthenticateUser from './application/use-case/AuthenticateUser';
import RegisterUser from './application/use-case/RegisterUser';
import AuthController from './infra/controller/AuthController';
import { ExpressHTTPServerAdapter } from './infra/http/ExpressHTTPServer';
import BcryptPasswordService from './infra/services/BcryptPasswordService';
import { initializeDataSource } from './infra/database/typeorm/DataSource';
import UserRepositoryTypeORM from './infra/repository/UserRepositoryTypeORM';
import { MessageRepositoryTypeORM } from './infra/repository/MessageRepositoryTypeORM';
import { ChatGateway } from './infra/http/ChatGateway';
import ListConversations from './application/use-case/ListConversations';
import MessageController from './infra/controller/MessageController';

async function main() {
  const dataSource = await initializeDataSource();
  const userRepository = new UserRepositoryTypeORM(dataSource);
  const messageRepository = new MessageRepositoryTypeORM(dataSource);
  const httpServer = new ExpressHTTPServerAdapter();
  const passwordService = new BcryptPasswordService();
  const registerUser = new RegisterUser(userRepository, passwordService);
  const authenticateUser = new AuthenticateUser(
    userRepository,
    passwordService,
  );
  const listConversations = new ListConversations(
    messageRepository,
    userRepository,
  );

  const authController = new AuthController(
    httpServer,
    registerUser,
    authenticateUser,
  );
  const messageController = new MessageController(
    httpServer,
    listConversations,
  );

  authController.registerRoutes();
  messageController.registerRoutes();

  const io = new Server(httpServer.getHttpServer(), {
    cors: {
      origin: '*',
    },
  });

  new ChatGateway(io, messageRepository, userRepository);

  httpServer.listen(Number(process.env.PORT) || 3000);
}

main();
