import AuthenticateUser from '../src/application/use-case/AuthenticateUser';
import RegisterUser from '../src/application/use-case/RegisterUser';
import UserRepositoryMemory from '../src/infra/repository/UserRepositoryMemory';
import BcryptPasswordService from '../src/infra/services/BcryptPasswordService';

test('should authenticate a user and return jwt token', async () => {
  const userRepository = new UserRepositoryMemory();
  const passwordService = new BcryptPasswordService();
  const registerUser = new RegisterUser(userRepository, passwordService);
  await registerUser.execute({
    name: 'Fulano de Tal',
    username: 'fulano',
    password: 'securepassword',
  });

  const authenticateUser = new AuthenticateUser(
    userRepository,
    passwordService,
  );
  const user = await authenticateUser.execute({
    username: 'fulano',
    password: 'securepassword',
  });

  expect(user).toHaveProperty('id');
  expect(user.name).toBe('Fulano de Tal');
  expect(user.username).toBe('fulano');
  expect(user).toHaveProperty('createdAt');
});
