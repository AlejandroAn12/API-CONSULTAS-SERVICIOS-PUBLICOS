import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) throw new UnauthorizedException('Credenciales no encontradas');

    const key = await this.prisma.apiKey.findUnique({
      where: { key: apiKey.toString() },
    });

    if (!key || !key.isActive) throw new UnauthorizedException('Crendenciales inválidas');

    return true;
  }
}
