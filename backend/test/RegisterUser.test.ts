import RegisterUser from '../src/application/use-case/RegisterUser';
import UserRepositoryMemory from '../src/infra/repository/UserRepositoryMemory';
import BcryptPasswordService from '../src/infra/services/BcryptPasswordService';

test('should register a new user successfully', async () => {
  const userRepository = new UserRepositoryMemory();
  const passwordService = new BcryptPasswordService();
  const registerUser = new RegisterUser(userRepository, passwordService);
  const user = await registerUser.execute({
    name: 'Fulano de Tal',
    username: 'fulano',
    password: 'securepassword',
  });
  expect(user).toHaveProperty('id');
  expect(user.name).toBe('Fulano de Tal');
  expect(user.username).toBe('fulano');
  expect(user).toHaveProperty('createdAt');
});
