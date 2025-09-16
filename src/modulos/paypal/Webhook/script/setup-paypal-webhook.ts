// scripts/setup-paypal-webhook.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaypalWebhookSetupService {
    constructor(
        private readonly httpService: HttpService,
        private readonly config: any,
    ) { }

    async setupWebhook(): Promise<void> {
        try {
            const webhookUrl = `${this.config.frontendUrl}/webhooks/paypal`;

            const webhookData = {
                url: webhookUrl,
                event_types: [
                    { name: 'PAYMENT.CAPTURE.COMPLETED' },
                    { name: 'PAYMENT.CAPTURE.DENIED' },
                    { name: 'PAYMENT.CAPTURE.REFUNDED' },
                    { name: 'CHECKOUT.ORDER.APPROVED' },
                    { name: 'CHECKOUT.ORDER.COMPLETED' },
                ],
            };

            const response = await firstValueFrom(
                this.httpService.post(
                    `${this.getBaseUrl()}/v1/notifications/webhooks`,
                    webhookData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')}`,
                        },
                    },
                ),
            );

            console.log('Webhook configured successfully:', response.data);
        } catch (error) {
            console.error('Error setting up webhook:', error.response?.data || error.message);
        }
    }

    private getBaseUrl(): string {
        return this.config.environment === 'production'
            ? 'https://api.paypal.com'
            : 'https://api.sandbox.paypal.com';
    }
}