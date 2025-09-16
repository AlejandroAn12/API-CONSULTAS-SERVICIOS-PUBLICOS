// paypal/paypal.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaypalService } from './paypal.service';
import { PaypalController } from './paypal.controller';
import { PaypalConfigProvider } from 'src/common/providers/paypal/paypal.provider';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [HttpModule, PrismaModule],
    providers: [PaypalService, PaypalConfigProvider],
    controllers: [PaypalController],
    exports: [PaypalService],
})
export class PaypalModule { }