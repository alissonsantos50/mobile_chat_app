import { randomUUID } from 'crypto';

export default class User {
  constructor(
    private readonly _id: string | null,
    private readonly _publicId: string,
    private readonly _name: string,
    private readonly _username: string,
    private readonly _passwordHash: string,
    private readonly _createdAt: Date,
  ) {}

  static create(name: string, username: string, passwordHash: string): User {
    const publicId = randomUUID();

    if (!name) throw new Error('O nome é obrigatório');
    if (!username) throw new Error('O nome de usuário é obrigatório');
    if (!passwordHash) throw new Error('Senha é obrigatória');

    return new User(null, publicId, name, username, passwordHash, new Date());
  }

  get id(): string | null {
    return this._id;
  }

  get publicId(): string {
    return this._publicId;
  }

  get name(): string {
    return this._name;
  }

  get username(): string {
    return this._username;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  getPasswordHash(): string {
    return this._passwordHash;
  }
}
