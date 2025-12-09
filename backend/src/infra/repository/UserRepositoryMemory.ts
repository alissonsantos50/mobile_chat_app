import User from '../../domain/entity/User';
import UserRepository from './UserRepository';

export default class UserRepositoryMemory implements UserRepository {
  private users: User[] = [];

  async getByPublicId(id: string): Promise<User | null> {
    const user = this.users.find((user) => user.publicId === id);
    return user || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = this.users.find((user) => user.username === username);
    return user || null;
  }

  async listAll(): Promise<User[] | null> {
    return this.users.length > 0 ? this.users : null;
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}
