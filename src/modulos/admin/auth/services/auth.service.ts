import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokensDto } from '../dto/tokens.dto';
import { UsuariosService } from '../../usuarios/services/usuarios.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { TokenHasher } from 'src/common/utils/token-hasher';
import { LoginDTO } from '../dto/login.dto';
import { IRegister } from '../dto/register.dto';
import { HashUtil } from 'src/common/utils/hash.util';
import { Role } from 'src/common/enums/role.enum';
import * as moment from 'moment-timezone';
import { randomBytes } from 'crypto';

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

      if (!user) throw new UnauthorizedException({
        statusCode: 401,
        message: 'Credenciales inválidas',
        errorCode: 'CREDENTIALS_INVALID'
      });

      const rolUsuario = await this.prisma.rol.findUnique({
        where: { id: user.roleId },
        select: {
          nombre: true
        }
      });

      const role = rolUsuario?.nombre || '';

      const tokens = await this.generateTokens(user.id, user.email, role);
      await this.storeRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error; // Lanza el error si es UnauthorizedException
      }
      // Lanza un error genérico si no es UnauthorizedException
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Error al iniciar sesión',
        errorCode: 'ERROR_LOGIN'
      });
    }
  }

  //Registro
async register(dto: IRegister) {
  const { nombres, email, password } = dto;
  const durationDays = 30;
  const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
  const newKey = randomBytes(32).toString('hex');

  try {
    // Seleccionar rol por defecto
    const defaultRoleId = await this.prisma.rol.findFirst({
      where: { nombre: Role.USUARIO },
      select: { id: true }
    });

    // Hashear contraseña
    const hashedPassword = await HashUtil.hashPassword(password);

    // Crear usuario
    const usuario = await this.prisma.usuario.create({
      data: {
        nombres,
        email,
        password: hashedPassword,
        roleId: defaultRoleId?.id ?? '',
      },
    });

    // 🎁 Obtener bono de bienvenida desde la tabla Setting
    const bonoSetting = await this.prisma.setting.findUnique({
      where: { key: "welcome_bonus" }
    });

    const bonoBienvenida = bonoSetting ? Number(bonoSetting.value) : 0;

    // Crear wallet con el bono
    await this.prisma.wallet.create({
      data: {
        usuarioId: usuario.id,
        balance: bonoBienvenida,
      },
    });

    // Crear API Key inicial
    await this.prisma.apiKey.create({ 
      data: {
        key: newKey,
        system: 'REST API',
        usuarioId: usuario.id,
        expiresAt: expiresAt
      }
    });

    return {
      message: `Registro exitoso ✅ Se ha acreditado un bono de bienvenida de $${bonoBienvenida} a tu cuenta`,
    };
  } catch (error) {
    console.error('ERROR => ', error);
    throw error;
  }
}



  async generateTokens(userId: string, email: string, role: string): Promise<TokensDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ sub: userId, email, role }, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: process.env.JWT_EXPIRES_IN }),
      this.jwtService.signAsync({ sub: userId, email, role }, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' }),
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
      throw new UnauthorizedException(
        {
          statusCode: 401,
          message: 'No autorizado',
          errorCode: 'UNAUTHORIZED'
        }
      );
    }

    const rolUsuario = await this.prisma.rol.findUnique({
      where: { id: user?.roleId },
      select: {
        nombre: true
      }
    });
    const role = rolUsuario?.nombre || '';

    const isValid = await TokenHasher.compareTokens(rt, user.refreshToken);
    if (!isValid) {
      throw new UnauthorizedException(
        {
          statusCode: 401,
          message: 'Token inválido',
          errorCode: 'INVALID_TOKEN'
        }
      );
    }

    const tokens = await this.generateTokens(user.id, user.email, role);
    await this.storeRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
