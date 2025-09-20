// paypal/paypal-webhook.controller.ts
import { Controller, Post, Req, Logger, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { PaypalService } from '../paypal.service';
import { PaypalWebhookService } from './paypal-webhook.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('webhooks/paypal')
export class PaypalWebhookController {
    private readonly logger = new Logger(PaypalWebhookController.name);

    constructor(
        private readonly paypalWebhookService: PaypalWebhookService,
        private readonly paypalService: PaypalService,
        private readonly prisma: PrismaService
    ) { }

    @Post()
    async handleWebhook(@Req() req: Request, @Res() res: Response) {
        try {
            // If you have a middleware that attaches rawBody, extend the Request type:
            const rawBody = (req as Request & { rawBody?: string }).rawBody || JSON.stringify(req.body);
            const isValid = await this.paypalWebhookService.verifyWebhookSignature(req.headers, rawBody);

            if (!isValid) {
                this.logger.warn('Invalid webhook signature');
                return res.status(400).json({ status: 'invalid_signature' });
            }

            const event = JSON.parse(rawBody);
            this.logger.log(`Evento recibido: ${event.event_type}, id: ${event.id}`);

            // Solo procesamos cada orden una vez
            switch (event.event_type) {
                case 'CHECKOUT.ORDER.APPROVED':
                    this.logger.log(`Orden aprobada: ${event.resource.id}`);
                    // Verificar y capturar la orden automaticamente
                    this.paypalService.verifyAndCaptureOrder(event.resource.id)
                    break;

                case 'PAYMENT.CAPTURE.COMPLETED':
                    const orderId = event.resource.supplementary_data.related_ids.order_id;
                    const captureId = event.resource.id;
                    const amount = event.resource.amount.value;
                    const currency = event.resource.amount.currency_code;

                    const dbOrder = await this.paypalWebhookService.getDbOrder(orderId);

                    if (dbOrder && dbOrder.status !== 'COMPLETED') {
                        const recarga = await this.paypalWebhookService.procesarRecarga(
                            dbOrder.usuarioId,
                            parseFloat(amount),
                            `Recarga PayPal - Order: ${orderId}`
                        );

                        await this.prisma.paypalOrder.update({
                            where: { orderId },
                            data: {
                                status: 'COMPLETED',
                                captureId,
                                capturedAt: new Date()
                            }
                        });

                        this.logger.log(`Recarga procesada: ${JSON.stringify(recarga)}`);
                    }
                    break;

                default:
                    this.logger.log(`Unhandled event type: ${event.event_type}`);
            }

            return res.status(200).json({ status: 'processed' });
        } catch (error) {
            this.logger.error('Error processing webhook', error);
            return res.status(500).json({ status: 'error', error: error.message });
        }
    }

    // private async processWebhookEvent(event: WebhookEventDto) {
    //     this.logger.log(`Processing event: ${event.event_type}`);

    //     switch (event.event_type) {
    //         case 'PAYMENT.CAPTURE.COMPLETED':
    //             await this.handlePaymentCaptureCompleted(event);
    //             break;

    //         case 'PAYMENT.CAPTURE.DENIED':
    //             await this.handlePaymentCaptureDenied(event);
    //             break;

    //         case 'PAYMENT.CAPTURE.REFUNDED':
    //             await this.handlePaymentRefunded(event);
    //             break;

    //         case 'CHECKOUT.ORDER.APPROVED':
    //             await this.handleOrderApproved(event);
    //             break;

    //         case 'CHECKOUT.ORDER.COMPLETED':
    //             await this.handleOrderCompleted(event);
    //             break;

    //         default:
    //             this.logger.log(`Unhandled event type: ${event.event_type}`);
    //     }
    // }

    // private async handlePaymentCaptureCompleted(event: WebhookEventDto) {
    //     try {
    //         const capture = event.resource;
    //         const orderId = capture.supplementary_data.related_ids.order_id;

    //         this.logger.log(`Payment captured for order: ${orderId}, Amount: ${capture.amount.value} ${capture.amount.currency_code}`);

    //         // Procesar la recarga automáticamente
    //         // const result = await this.paypalService.verifyAndCaptureOrder(orderId);

    //         // this.logger.log(`Recharge processed successfully for user: ${result.recarga.usuarioId}`);

    //     } catch (error) {
    //         this.logger.error('Error handling payment capture:', error);
    //         // Aquí podrías implementar reintentos o notificaciones
    //     }
    // }

    // private async handlePaymentCaptureDenied(event: WebhookEventDto) {
    //     const capture = event.resource;
    //     this.logger.warn(`Payment denied for capture: ${capture.id}, Reason: ${capture.status_details.reason}`);

    //     // Aquí puedes notificar al usuario o registrar el fallo
    // }

    // private async handlePaymentRefunded(event: WebhookEventDto) {
    //     const refund = event.resource;
    //     this.logger.log(`Payment refunded: ${refund.id}, Amount: ${refund.amount.value} ${refund.amount.currency_code}`);

    //     // Aquí puedes revertir la recarga en tu sistema
    //     // await this.reverseRecharge(refund.capture_id);
    // }

    // // Manejar orden aprobada
    // private async handleOrderApproved(event: WebhookEventDto) {
    //     const order = event.resource;
    //     this.logger.log(`Order approved: ${order.id}`);

    //     try {
    //         // Buscar la orden en tu base de datos, no en PayPal
    //         const dbOrder = await this.paypalService.findOrderInDB(order.id);

    //         if (!dbOrder) {
    //             this.logger.warn(`Order ${order.id} not found in DB`);
    //             return;
    //         }

    //         // Capturar la orden y procesar la recarga
    //         const result = await this.paypalService.verifyAndCaptureOrder(
    //             order.id,
    //             dbOrder.usuarioId,
    //         );

    //         this.logger.log(
    //             `Order ${order.id} captured successfully. Recarga: ${result.recarga.id}`,
    //         );
    //     } catch (error) {
    //         this.logger.error(
    //             `Error capturing order ${order.id}:`,
    //             error.message,
    //         );
    //     }
    // }


    // private async handleOrderCompleted(event: WebhookEventDto) {
    //     const order = event.resource;
    //     this.logger.log(`Order completed: ${order.id}`);

    //     // Orden completada (útil para tracking)
    // }
}