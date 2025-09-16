// paypal/paypal.provider.ts
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const PAYPAL_CONFIG = 'PAYPAL_CONFIG';

export const PaypalConfigProvider: Provider = {
    provide: PAYPAL_CONFIG,
    useFactory: (configService: ConfigService) => ({
        clientId: configService.get<string>('PAYPAL_CLIENT_ID'),
        clientSecret: configService.get<string>('PAYPAL_CLIENT_SECRET'),
        environment: configService.get<string>('PAYPAL_ENVIRONMENT'),
        brandName: configService.get<string>('PAYPAL_BRAND_NAME'),
        frontendUrl: configService.get<string>('FRONTEND_URL'),
    }),
    inject: [ConfigService],
};