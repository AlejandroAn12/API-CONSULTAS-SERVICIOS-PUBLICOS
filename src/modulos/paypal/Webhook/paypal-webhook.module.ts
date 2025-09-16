// paypal/paypal-webhook.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaypalWebhookController } from './paypal-webhook.controller';
import { PaypalWebhookService } from './paypal-webhook.service';
import { PaypalService } from '../paypal.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PaypalConfigProvider } from 'src/common/providers/paypal/paypal.provider';

@Module({
    imports: [HttpModule, ConfigModule, PrismaModule],
    controllers: [PaypalWebhookController],
    providers: [
        PaypalWebhookService,
        PaypalService,
        PaypalConfigProvider, // Añadir el provider de configuración
    ],
    exports: [PaypalWebhookService],
})
export class PaypalWebhookModule { }