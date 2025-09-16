import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BalanceMiddleware implements NestMiddleware {
    constructor(private prisma: PrismaService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        // Rutas libres (no requieren saldo ni validación)
        const freePaths = [
            { path: '/auth/login', method: 'POST' },
            { path: '/auth/register', method: 'POST' },
            { path: '/auth/refresh', method: 'POST' },
        ];

        const isFree = freePaths.some(
            (p) => req.path.startsWith(p.path) && req.method === p.method,
        );

        if (isFree) return next();

        // Obtenemos endpoint y método actual
        const endpoint = req.path;
        const method = req.method;

        // Buscamos si ese endpoint tiene un precio configurado
        const endpointConfig = await this.prisma.endpointPrecio.findFirst({
            where: { endpoint, method },
        });

        // Si no hay precio → pasa directo (es gratis)
        if (!endpointConfig) return next();

        // Aquí asumimos que el `userId` se guarda en `req.user` por el guard de JWT
        const userId = (req as any).user?.id;
        if (!userId) {
            throw new ForbiddenException('Usuario no autenticado');
        }

        // Consultamos el balance del usuario
        const wallet = await this.prisma.wallet.findUnique({
            where: { usuarioId: userId },
        });

        if (!wallet || wallet.balance < endpointConfig.costo) {
            throw new ForbiddenException('Saldo insuficiente');
        }

        // Descontamos el saldo
        await this.prisma.wallet.update({
            where: { usuarioId: userId },
            data: { balance: { decrement: endpointConfig.costo } },
        });

        return next();
    }
}
