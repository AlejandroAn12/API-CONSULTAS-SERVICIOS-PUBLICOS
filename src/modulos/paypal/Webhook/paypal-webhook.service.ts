// paypal/paypal-webhook.service.ts
import { Injectable, Inject, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaypalWebhookService {
  private readonly logger = new Logger(PaypalWebhookService.name);

  constructor(
    @Inject('PAYPAL_CLIENT_ID') private readonly clientId: string,
    @Inject('PAYPAL_CLIENT_SECRET') private readonly clientSecret: string,
    @Inject('PAYPAL_WEBHOOK_ID') private readonly webhookId: string,
    @Inject('PAYPAL_ENVIRONMENT') private readonly environment: 'sandbox' | 'production',
    private readonly prisma: PrismaService,
  ) { }

  private getBaseUrl(): string {
    return this.environment === 'production'
      ? 'https://api.paypal.com'
      : 'https://api-m.sandbox.paypal.com';
  }

  async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    const res = await fetch(`${this.getBaseUrl()}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = await res.json();
    if (!data.access_token) throw new Error('No se pudo obtener access token de PayPal');
    return data.access_token;
  }
  

  async verifyWebhookSignature(headers: any, rawBody: string): Promise<boolean> {
    const accessToken = await this.getAccessToken();

    const verificationRequest = {
      transmission_id: headers['paypal-transmission-id'],
      transmission_time: headers['paypal-transmission-time'],
      cert_url: headers['paypal-cert-url'],
      auth_algo: headers['paypal-auth-algo'],
      transmission_sig: headers['paypal-transmission-sig'],
      webhook_id: this.webhookId,
      webhook_event: JSON.parse(rawBody),
    };

    const res = await fetch(`${this.getBaseUrl()}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(verificationRequest),
    });

    const result = await res.json();
    this.logger.log(`Verification result: ${JSON.stringify(result)}`);
    return result.verification_status === 'SUCCESS';
  }

  // Obtener orden de la DB
  async getDbOrder(orderId: string) {
    return this.prisma.paypalOrder.findUnique({ where: { orderId } });
  }

  // Capturar orden y procesar recarga
  async captureOrder(orderId: string, usuarioId: string) {
    const dbOrder = await this.getDbOrder(orderId);
    if (!dbOrder) throw new Error('Orden no encontrada');
    if (dbOrder.status === 'COMPLETED') {
      this.logger.log(`Order ${orderId} ya fue procesada`);
      return dbOrder;
    }

    // Capturar pago
    const captureRequest = new (require('@paypal/checkout-server-sdk').orders.OrdersCaptureRequest)(orderId);
    captureRequest.prefer('return=representation');

    const client = new (require('@paypal/checkout-server-sdk').core.PayPalHttpClient)(
      new (require('@paypal/checkout-server-sdk').core.SandboxEnvironment)(this.clientId, this.clientSecret)
    );

    const response = await client.execute(captureRequest);
    const result = response.result;

    if (result.status !== 'COMPLETED') throw new Error('Pago no completado');

    // Procesar recarga en tu sistema
    const recarga = await this.procesarRecarga(
      usuarioId,
      parseFloat(result.purchase_units[0].amount.value),
      `Recarga PayPal - Order ${orderId}`,
    );

    // Actualizar DB
    await this.prisma.paypalOrder.update({
      where: { orderId },
      data: {
        status: 'COMPLETED',
        captureId: result.id,
        capturedAt: new Date(),
      },
    });

    console.log('Recarga procesada => ', recarga)

    return recarga;
  }

  async procesarRecarga(usuarioId: string, monto: number, descripcion: string) {
    // Implementa tu lógica de recarga aquí
    return { id: `${usuarioId}-${Date.now()}`, monto, descripcion };
  }
}