import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(username: string, password: string) {
    // Aquí deberías validar usuario/contraseña reales
    if (username === 'admin' && password === '123456') {
      const payload = { username };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new Error('Credenciales inválidas');
  }
}
