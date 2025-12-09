import bcrypt from 'bcrypt';
import IPasswordService from './PasswordService';

export default class BcryptPasswordService implements IPasswordService {
  private readonly saltRound = 10;

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRound);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
