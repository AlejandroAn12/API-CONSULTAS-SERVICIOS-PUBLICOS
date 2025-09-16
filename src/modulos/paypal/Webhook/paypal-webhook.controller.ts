// paypal/paypal-webhook.controller.ts
import { Controller, Post, Headers, RawBodyRequest, Req, Logger } from '@nestjs/common';
import { Request } from 'express';
import { PaypalService } from '../paypal.service';
import { WebhookEventDto } from './dto/webhook-event.dto';
import { PaypalWebhookService } from './paypal-webhook.service';

@Controller('webhooks/paypal')
export class PaypalWebhookController {
    private readonly logger = new Logger(PaypalWebhookController.name);

    constructor(
        private readonly paypalWebhookService: PaypalWebhookService,
        private readonly paypalService: PaypalService,
    ) { }

    @Post()
    async handleWebhook(
        @Headers('paypal-transmission-id') transmissionId: string,
        @Headers('paypal-transmission-time') transmissionTime: string,
        @Headers('paypal-transmission-sig') transmissionSig: string,
        @Headers('paypal-cert-url') certUrl: string,
        @Headers('paypal-auth-algo') authAlgo: string,
        @Headers('paypal-webhook-id') webhookId: string,
        @Req() req: RawBodyRequest<Request>,
    ) {
        try {
            this.logger.log(`Received webhook: ${webhookId}, Event: ${transmissionId}`);

            // Verificar la firma del webhook
            const isValid = await this.paypalWebhookService.verifyWebhookSignature(
                transmissionId,
                transmissionTime,
                transmissionSig,
                certUrl,
                authAlgo,
                webhookId,
                (req.rawBody ?? '').toString(),
            );

            if (!isValid) {
                this.logger.warn('Invalid webhook signature');
                return { status: 'invalid_signature' };
            }

            const event: WebhookEventDto = req.body;

            // Procesar el evento según su tipo
            await this.processWebhookEvent(event);

            return { status: 'processed' };

        } catch (error) {
            this.logger.error('Error processing webhook:', error);
            return { status: 'error', error: error.message };
        }
    }

    private async processWebhookEvent(event: WebhookEventDto) {
        this.logger.log(`Processing event: ${event.event_type}`);

        switch (event.event_type) {
            case 'PAYMENT.CAPTURE.COMPLETED':
                await this.handlePaymentCaptureCompleted(event);
                break;

            case 'PAYMENT.CAPTURE.DENIED':
                await this.handlePaymentCaptureDenied(event);
                break;

            case 'PAYMENT.CAPTURE.REFUNDED':
                await this.handlePaymentRefunded(event);
                break;

            case 'CHECKOUT.ORDER.APPROVED':
                await this.handleOrderApproved(event);
                break;

            case 'CHECKOUT.ORDER.COMPLETED':
                await this.handleOrderCompleted(event);
                break;

            default:
                this.logger.log(`Unhandled event type: ${event.event_type}`);
        }
    }

    private async handlePaymentCaptureCompleted(event: WebhookEventDto) {
        try {
            const capture = event.resource;
            const orderId = capture.supplementary_data.related_ids.order_id;

            this.logger.log(`Payment captured for order: ${orderId}, Amount: ${capture.amount.value} ${capture.amount.currency_code}`);

            // Procesar la recarga automáticamente
            // const result = await this.paypalService.verifyAndCaptureOrder(orderId);

            // this.logger.log(`Recharge processed successfully for user: ${result.recarga.usuarioId}`);

        } catch (error) {
            this.logger.error('Error handling payment capture:', error);
            // Aquí podrías implementar reintentos o notificaciones
        }
    }

    private async handlePaymentCaptureDenied(event: WebhookEventDto) {
        const capture = event.resource;
        this.logger.warn(`Payment denied for capture: ${capture.id}, Reason: ${capture.status_details.reason}`);

        // Aquí puedes notificar al usuario o registrar el fallo
    }

    private async handlePaymentRefunded(event: WebhookEventDto) {
        const refund = event.resource;
        this.logger.log(`Payment refunded: ${refund.id}, Amount: ${refund.amount.value} ${refund.amount.currency_code}`);

        // Aquí puedes revertir la recarga en tu sistema
        // await this.reverseRecharge(refund.capture_id);
    }

    private async handleOrderApproved(event: WebhookEventDto) {
        const order = event.resource;
        this.logger.log(`Order approved: ${order.id}`);

        // El usuario aprobó el pago, pero aún no se ha capturado
    }

    private async handleOrderCompleted(event: WebhookEventDto) {
        const order = event.resource;
        this.logger.log(`Order completed: ${order.id}`);

        // Orden completada (útil para tracking)
    }
}