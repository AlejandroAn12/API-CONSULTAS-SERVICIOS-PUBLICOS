// src/webhooks/webhooks.controller.ts
import { Controller, Post, Req, Res, Headers } from '@nestjs/common';
import { Request, Response } from 'express';
import { StripeService } from '../stripe/stripe.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('stripe')
  async handleStripeWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    const payload = req.body;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!endpointSecret) {
      throw new Error('Stripe webhook secret is not defined in environment variables.');
    }

    try {
      const event = this.stripeService.constructEvent(
        payload,
        signature,
        endpointSecret,
      );

      // Manejar diferentes tipos de eventos
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          // Lógica para manejar pago exitoso
          console.log('PaymentIntent was successful!', paymentIntent.id);
          break;
        case 'payment_intent.payment_failed':
          const failedPaymentIntent = event.data.object;
          // Lógica para manejar pago fallido
          console.log('PaymentIntent failed!', failedPaymentIntent.id);
          break;
        case 'checkout.session.completed':
          const session = event.data.object;
          // Lógica para manejar sesión de checkout completada
          console.log('Checkout session completed!', session.id);
          break;
        // Agrega más casos según necesites
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error.message);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
}