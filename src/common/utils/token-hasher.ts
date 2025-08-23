import * as bcrypt from 'bcrypt';

export class TokenHasher {
  private static readonly saltRounds = 10;

  static async hashToken(token: string): Promise<string> {
    return bcrypt.hash(token, this.saltRounds);
  }

  static async compareTokens(rawToken: string, hashedToken: string): Promise<boolean> {
    return bcrypt.compare(rawToken, hashedToken);
  }
}
