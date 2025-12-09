import { DataSource, MongoRepository } from 'typeorm';
import { Message } from '../../domain/entity/Message';
import { MessageModel } from '../database/typeorm/model/MessageModel';
import { MessageRepository } from './MessageRepository';
import { ObjectId } from 'mongodb';
import User from '../../domain/entity/User';

export class MessageRepositoryTypeORM implements MessageRepository {
  private readonly messageRepository: MongoRepository<MessageModel>;

  constructor(private readonly dataSource: DataSource) {
    this.messageRepository = dataSource.getMongoRepository(MessageModel);
  }

  async save(message: Message): Promise<void> {
    const model = this.parseDomainToModel(message);
    await this.messageRepository.save(model);
  }

  async list(fromUser: User, toUser: User): Promise<Message[]> {
    const messages = await this.messageRepository
      .aggregate<MessageModel>([
        {
          $match: {
            $or: [
              {
                from: new ObjectId(fromUser.id!),
                to: new ObjectId(toUser.id!),
              },
              {
                from: new ObjectId(toUser.id!),
                to: new ObjectId(fromUser.id!),
              },
            ],
          },
        },
        { $sort: { created_at: 1 } },
        {
          $lookup: {
            from: 'users',
            localField: 'from',
            foreignField: '_id',
            as: 'from',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'to',
            foreignField: '_id',
            as: 'to',
          },
        },
        { $unwind: '$from' },
        { $unwind: '$to' },
      ])
      .toArray();
    return messages.map((model) => this.parseModelToDomain(model));
  }

  async findConversationsByUserId(userId: string): Promise<Message[]> {
    const conversations = await this.messageRepository
      .aggregate<MessageModel>([
        {
          $match: {
            $or: [{ from: new ObjectId(userId) }, { to: new ObjectId(userId) }],
          },
        },
        { $sort: { created_at: -1 } },
        {
          $group: {
            _id: {
              $cond: [{ $eq: ['$from', new ObjectId(userId)] }, '$to', '$from'],
            },
            doc: { $first: '$$ROOT' },
          },
        },
        { $replaceRoot: { newRoot: '$doc' } },
        {
          $lookup: {
            from: 'users',
            localField: 'from',
            foreignField: '_id',
            as: 'from',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'to',
            foreignField: '_id',
            as: 'to',
          },
        },
        { $unwind: '$from' },
        { $unwind: '$to' },
      ])
      .toArray();
    return conversations.map((model) => this.parseModelToDomain(model));
  }

  private parseDomainToModel(message: Message): MessageModel {
    const model = new MessageModel();
    Object.assign(model, {
      public_id: message.publicId,
      from: new ObjectId(message.from),
      to: new ObjectId(message.to),
      text: message.text,
      created_at: message.createdAt,
    });
    return model;
  }

  private parseModelToDomain(model: MessageModel): Message {
    return new Message(
      model._id.toString(),
      model.public_id,
      model.from.public_id,
      model.to.public_id,
      model.text,
      model.created_at,
    );
  }
}
