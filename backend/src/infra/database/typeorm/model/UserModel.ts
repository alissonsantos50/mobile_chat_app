import { ObjectId } from 'mongodb';
import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity('users')
export class UserModel {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  public_id!: string;

  @Column()
  name!: string;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}
