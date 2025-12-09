import jwt from 'jsonwebtoken';
import AuthenticateUser from '../../application/use-case/AuthenticateUser';
import RegisterUser from '../../application/use-case/RegisterUser';
import HTTPServer from '../http/HTTPServer';

export default class AuthController {
  constructor(
    private readonly httpServer: HTTPServer,
    private readonly registerUser: RegisterUser,
    private readonly authenticateUser: AuthenticateUser,
  ) {}

  registerRoutes(): void {
    this.httpServer.route(
      'post',
      '/register',
      async (
        params: unknown,
        body: { name: string; username: string; password: string },
      ) => {
        const input = body;
        if (!input || !input.name || !input.username || !input.password) {
          throw new Error('Dados inválidos para cadastro');
        }
        const output = await this.registerUser.execute({
          name: input.name,
          username: input.username,
          password: input.password,
        });
        return { response: output, statusCode: 201 };
      },
    );

    this.httpServer.route(
      'post',
      '/login',
      async (params: unknown, body: { username: string; password: string }) => {
        const input = body;
        if (!input || !input.username || !input.password) {
          throw new Error('Usuário e senha são obrigatórios');
        }
        const output = await this.authenticateUser.execute({
          username: input.username,
          password: input.password,
        });

        const token = jwt.sign(
          { userId: output.id, name: output.name },
          process.env.JWT_SECRET!,
          {
            expiresIn: '12h',
          },
        );

        return {
          response: {
            ...output,
            token,
          },
          statusCode: 200,
        };
      },
    );
  }
}
