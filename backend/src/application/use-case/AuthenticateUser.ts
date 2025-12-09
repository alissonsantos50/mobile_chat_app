import IUserRepository from '../../infra/repository/UserRepository';
import IPasswordService from '../../infra/services/PasswordService';

export default class AuthenticateUser {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService,
  ) {}

  async execute(input: AuthenticateUserInput): Promise<AuthenticateUserOutput> {
    const user = await this.userRepository.findByUsername(input.username);
    if (!user) throw new Error('Credenciais inválidas');

    const isPasswordValid = await this.passwordService.compare(
      input.password,
      user.getPasswordHash(),
    );
    if (!isPasswordValid) throw new Error('Credenciais inválidas');

    return {
      id: user.publicId,
      name: user.name,
      username: user.username,
      createdAt: user.createdAt,
    };
  }
}

type AuthenticateUserInput = {
  username: string;
  password: string;
};

type AuthenticateUserOutput = {
  id: string;
  name: string;
  username: string;
  createdAt: Date;
};
