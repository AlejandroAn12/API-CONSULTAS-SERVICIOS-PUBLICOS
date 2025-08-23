import * as bcrypt from 'bcrypt';

export class HashUtil {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hashea una contraseña usando bcrypt.
   * @param password Contraseña en texto plano.
   * @returns Contraseña hasheada.
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compara una contraseña en texto plano con su hash.
   * @param password Contraseña en texto plano.
   * @param hash Contraseña hasheada.
   * @returns true si coinciden, false si no.
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

}
