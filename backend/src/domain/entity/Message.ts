import { randomUUID } from 'crypto';

export class Message {
  constructor(
    private readonly _id: string | null,
    private readonly _publicId: string,
    private readonly _from: string,
    private readonly _to: string,
    private readonly _text: string,
    private readonly _createdAt: Date,
  ) {}

  static create(from: string, to: string, text: string): Message {
    const publicId = randomUUID();
    const createdAt = new Date();
    return new Message(null, publicId, from, to, text, createdAt);
  }

  get id(): string | null {
    return this._id;
  }

  get publicId(): string {
    return this._publicId;
  }

  get from(): string {
    return this._from;
  }

  get to(): string {
    return this._to;
  }

  get text(): string {
    return this._text;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
