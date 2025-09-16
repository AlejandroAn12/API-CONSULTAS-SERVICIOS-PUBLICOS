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
      include: { usuario: true },
    });

    if (!key || !key.isActive) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'API KEY inválida, si tiene inconvenientes contacte a nuestro equipo de soporte.',
        errorCode: 'INVALID_API_KEY',
      });
    }

    if (new Date() > key.expiresAt) {
      await this.prisma.apiKey.update({
        where: { id: key.id },
        data: { isActive: false },
      });

      throw new UnauthorizedException({
        statusCode: 401,
        message: 'La API Key proporcionada ha caducado. Renueva tu clave para mantener el acceso a los servicios.',
        errorCode: 'EXPIRED_API_KEY',
      });
    }

    // --- NUEVO: Descuento por endpoint ---
    const path = request.route?.path; // ej: /api/v1/cedula/:numero
    const method = request.method;

    // Normalizamos path para que coincida con DB (quitamos params)
    const cleanPath = path.replace(/:\w+/g, '');

    const endpoint = await this.prisma.endpointPrecio.findFirst({
      where: { endpoint: cleanPath, method },
    });

    if (endpoint) {
      // Consultamos wallet del usuario
      const wallet = await this.prisma.wallet.findUnique({
        where: { usuarioId: key.usuarioId },
      });

      if (!wallet || wallet.balance < endpoint.costo) {
        throw new UnauthorizedException({
          statusCode: 403,
          message: 'Saldo insuficiente',
          errorCode: 'INSUFFICIENT_BALANCE',
        });
      }
      // Descontamos el costo
      const newBalance = wallet.balance - endpoint.costo;

      await this.prisma.wallet.update({
        where: { usuarioId: key.usuarioId },
        data: { balance: newBalance },
      });

      // Registrar consumo
      await this.prisma.consumo.create({
        data: {
          usuarioId: key.usuarioId,
          endpointId: endpoint.id,
          costo: endpoint.costo,
          saldoRestante: newBalance,
          fecha: new Date(),
        },
      });
    }

    request.user = key.usuario; // opcional, pasar usuario al controlador
    return true;
  }
}
