import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) throw new UnauthorizedException('API Key missing');

    const key = await this.prisma.apiKey.findUnique({
      where: { key: apiKey.toString() },
    });

    if (!key || !key.isActive) {
      throw new UnauthorizedException('Invalid API Key');
    }

    if (new Date() > key.expiresAt) {
      throw new UnauthorizedException('La API Key proporcionada ha caducado. Renueva tu clave para mantener el acceso a los servicios.');
    }

    return true;
  }
}
