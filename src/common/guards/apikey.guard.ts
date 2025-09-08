import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private prisma: PrismaService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) throw new UnauthorizedException('API Key missing');

    const key = await this.prisma.apiKey.findUnique({
      where: { key: apiKey.toString() },
    });

    if (!key || !key.isActive) {
      console.log('Key', key)
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'API KEY inválida, si tiene inconvenientes contacte a nuestro equipo de soporte.',
        errorCode: 'INVALID_API_KEY'
      });
    }

    if (new Date() > key.expiresAt) {
      await this.prisma.apiKey.update({
        where: {id: key.id},
        data:{
          isActive: false
        }
      });

      throw new UnauthorizedException({
        statusCode: 401,
        message: 'La API Key proporcionada ha caducado. Renueva tu clave para mantener el acceso a los servicios.',
        errorCode: 'EXPIRED_API_KEY'
      });
    }

    return true;
  }
}
