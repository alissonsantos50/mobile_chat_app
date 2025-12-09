import IPasswordService from '../../infra/services/PasswordService';
import IUserRepository from '../../infra/repository/UserRepository';
import User from '../../domain/entity/User';

export default class RegisterUser {
  constructor(
    private userRepository: IUserRepository,
    private passwordService: IPasswordService,
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    const existingUser = await this.userRepository.findByUsername(
      input.username,
    );

    if (existingUser) throw new Error('Usuário já cadastrado');

    if (!input.password || input.password.trim().length < 6) {
      throw new Error('A senha deve ter no mínimo 6 caracteres');
    }

    const passwordHash = await this.passwordService.hash(input.password);
    const user = User.create(input.name, input.username, passwordHash);
    await this.userRepository.save(user);

    return {
      id: user.publicId,
      name: user.name,
      username: user.username,
      createdAt: user.createdAt,
    };
  }
}

type RegisterUserInput = {
  name: string;
  username: string;
  password: string;
};

type RegisterUserOutput = {
  id: string;
  name: string;
  username: string;
  createdAt: Date;
};
