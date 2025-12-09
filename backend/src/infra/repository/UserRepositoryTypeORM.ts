import { DataSource, MongoRepository, ObjectId } from 'typeorm';
import { UserModel } from '../database/typeorm/model/UserModel';
import UserRepository from './UserRepository';
import User from '../../domain/entity/User';

export default class UserRepositoryTypeORM implements UserRepository {
  private readonly userRepository: MongoRepository<UserModel>;

  constructor(private readonly dataSource: DataSource) {
    this.userRepository = dataSource.getMongoRepository(UserModel);
  }

  async save(user: User): Promise<void> {
    const model = this.parseDomainToModel(user);
    await this.userRepository.save(model);
  }

  async listAll(): Promise<User[] | null> {
    const models = await this.userRepository.find();
    if (models.length === 0) return null;
    return models.map((model) => this.parseModelToDomain(model));
  }

  async findByUsername(username: string): Promise<User | null> {
    const model = await this.userRepository.findOne({ where: { username } });
    if (!model) return null;
    return this.parseModelToDomain(model);
  }

  async getByPublicId(publicId: string): Promise<User | null> {
    const model = await this.userRepository.findOne({
      where: { public_id: publicId },
    });
    if (!model) return null;
    return this.parseModelToDomain(model);
  }

  private parseDomainToModel(user: User): UserModel {
    const model = new UserModel();
    Object.assign(model, {
      public_id: user.publicId,
      name: user.name,
      username: user.username,
      password: user.getPasswordHash(),
      created_at: user.createdAt,
    });
    return model;
  }

  private parseModelToDomain(model: UserModel): User {
    return new User(
      model._id.toString(),
      model.public_id,
      model.name,
      model.username,
      model.password,
      model.created_at,
    );
  }
}
