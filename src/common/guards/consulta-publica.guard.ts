import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CONSULTA_PUBLICA_KEY } from '../decorators/consulta-publica.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConsultaPublicaGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isConsulta = this.reflector.getAllAndOverride<boolean>(
      CONSULTA_PUBLICA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isConsulta) return true; // Si no está marcada, deja pasar al siguiente guard

    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    const userId = request.headers['x-user-id'];

    if (!apiKey || !userId) {
      throw new UnauthorizedException('Faltan headers x-api-key o x-user-id');
    }

    const keyRecord = await this.prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: { usuario: true },
    });

    if (!keyRecord || !keyRecord.activo) {
      throw new UnauthorizedException('API Key inválida o inactiva');
    }

    if (keyRecord.usuarioId !== userId) {
      throw new ForbiddenException('No autorizado para este usuario');
    }

    // Puedes añadir lógica adicional según el usuario
    request.user = keyRecord.usuario;
    return true;
  }
}