import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  ObjectIdColumn,
} from 'typeorm';
import { UserModel } from './UserModel';
import { ObjectId } from 'mongodb';

@Entity('messages')
export class MessageModel {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  public_id!: string;

  @ManyToOne(() => UserModel)
  @JoinColumn({ name: 'from', referencedColumnName: '_id' })
  from!: UserModel;

  @ManyToOne(() => UserModel)
  @JoinColumn({ name: 'to', referencedColumnName: '_id' })
  to!: UserModel;

  @Column()
  text!: string;

  @CreateDateColumn()
  created_at!: Date;
}
