import User from '../../domain/entity/User';

export default interface UserRepository {
  getByPublicId(publicId: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  listAll(): Promise<User[] | null>;
  save(user: User): Promise<void>;
}
