import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokensDto } from '../dto/tokens.dto';
import { UsuariosService } from '../../usuarios/services/usuarios.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { TokenHasher } from 'src/common/utils/token-hasher';
import { LoginDTO } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.usuario.findUnique({ where: { email } });
    if (!user || !user.password) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  async login(dto: LoginDTO): Promise<TokensDto> {
    try {
      const user = await this.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const tokens = await this.generateTokens(user.id, user.email);
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error; // Lanza el error si es UnauthorizedException
      }
      // Lanza un error genérico si no es UnauthorizedException
      throw new UnauthorizedException('Error al iniciar sesión');
    }
  }

  async generateTokens(userId: string, email: string): Promise<TokensDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ sub: userId, email }, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' }),
      this.jwtService.signAsync({ sub: userId, email }, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' }),
    ]);

    return { accessToken, refreshToken };
  }

  async storeRefreshToken(userId: string, refreshToken: string) {
    const hashedToken = await TokenHasher.hashToken(refreshToken);
    await this.prisma.usuario.update({
      where: { id: userId },
      data: { refreshToken: hashedToken },
    });
  }

  async refreshTokens(userId: string, rt: string): Promise<TokensDto> {
    const user = await this.prisma.usuario.findUnique({ where: { id: userId } });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('No autorizado');
    }

    const isValid = await TokenHasher.compareTokens(rt, user.refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Token inválido');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
