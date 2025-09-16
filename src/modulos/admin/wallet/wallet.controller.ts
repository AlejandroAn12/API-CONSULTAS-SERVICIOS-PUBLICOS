import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
    constructor(private walletService: WalletService) { }

    // Ver saldo
    @Get(':usuarioId')
    async getBalance(@Param('usuarioId') usuarioId: string) {
        return this.walletService.getBalance(usuarioId);
    }

    // Recargar saldo
    @Post(':usuarioId/recharge')
    async recharge(
        @Param('usuarioId') usuarioId: string,
        @Body() body: { monto: number; descripcion?: string },
    ) {
        return this.walletService.recharge(usuarioId, body.monto, body.descripcion);
    }

    // Ver transacciones
    @Get(':usuarioId/transactions')
    async getTransactions(@Param('usuarioId') usuarioId: string) {
        return this.walletService.getTransactions(usuarioId);
    }
}
