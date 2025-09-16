// paypal/paypal-webhook.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaypalWebhookService {
    constructor(
        @Inject('PAYPAL_CONFIG') private readonly config: any,
        private readonly httpService: HttpService,
    ) { }

    // Verificar la autenticidad del webhook
    async verifyWebhookSignature(
        transmissionId: string,
        transmissionTime: string,
        transmissionSig: string,
        certUrl: string,
        authAlgo: string,
        webhookId: string,
        requestBody: string,
    ): Promise<boolean> {
        try {
            // Construir el payload para verificación
            const verificationRequest = {
                auth_algo: authAlgo,
                cert_url: certUrl,
                transmission_id: transmissionId,
                transmission_sig: transmissionSig,
                transmission_time: transmissionTime,
                webhook_id: webhookId,
                webhook_event: JSON.parse(requestBody),
            };

            // Verificar con la API de PayPal
            const response = await firstValueFrom(
                this.httpService.post(
                    `${this.getBaseUrl()}/v1/notifications/verify-webhook-signature`,
                    verificationRequest,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')}`,
                        },
                    },
                ),
            );

            return response.data.verification_status === 'SUCCESS';
        } catch (error) {
            console.error('Error verifying webhook signature:', error);
            return false;
        }
    }

    // Verificación local alternativa
    verifyWebhookLocally(
        transmissionId: string,
        transmissionTime: string,
        transmissionSig: string,
        webhookId: string,
        requestBody: string,
    ): boolean {
        // Solo para desarrollo - en producción usar verificación de PayPal
        if (this.config.environment === 'sandbox') {
            return true;
        }

        try {
            // Implementar verificación local si es necesario
            const expectedWebhookId = this.config.webhookId;
            return webhookId === expectedWebhookId;
        } catch (error) {
            return false;
        }
    }

    private getBaseUrl(): string {
        return this.config.environment === 'production'
            ? 'https://api.paypal.com'
            : 'https://api.sandbox.paypal.com';
    }
}