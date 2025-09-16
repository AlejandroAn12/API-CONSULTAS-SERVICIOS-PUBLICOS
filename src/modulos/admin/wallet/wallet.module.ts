import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
    imports: [PrismaModule],
    providers: [
        WalletService
    ],
    controllers: [
        WalletController
    ]
})
export class WalletModule { }
