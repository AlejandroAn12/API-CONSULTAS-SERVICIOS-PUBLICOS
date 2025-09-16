import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class WalletService {
    constructor(private prisma: PrismaService) { }

    // Crear wallet para un usuario si no existe
    async createWalletForUser(usuarioId: string) {
        const exists = await this.prisma.wallet.findUnique({ where: { usuarioId } });
        if (exists) return exists;

        return this.prisma.wallet.create({
            data: { usuarioId },
        });
    }

    // Ver saldo de usuario
    async getBalance(usuarioId: string) {
        const wallet = await this.prisma.wallet.findUnique({ where: { usuarioId } });
        if (!wallet) throw new NotFoundException('Wallet no encontrada');
        return wallet.balance;
    }

    // Recargar saldo
    async recharge(usuarioId: string, monto: number, descripcion = 'Recarga manual') {
        if (monto <= 0) throw new BadRequestException('El monto debe ser mayor a 0');

        return this.prisma.$transaction(async (tx) => {
            const wallet = await tx.wallet.upsert({
                where: { usuarioId },
                update: { balance: { increment: monto } },
                create: { usuarioId, balance: monto },
            });

            await tx.transaccion.create({
                data: {
                    tipo: 'RECARGA',
                    monto,
                    descripcion,
                    walletId: wallet.id,
                },
            });

            return wallet;
        });
    }

    // Historial de transacciones
    async getTransactions(usuarioId: string) {
        const wallet = await this.prisma.wallet.findUnique({ where: { usuarioId } });
        if (!wallet) throw new NotFoundException('Wallet no encontrada');

        return this.prisma.transaccion.findMany({
            where: { walletId: wallet.id },
            orderBy: { createdAt: 'desc' },
        });
    }
}
