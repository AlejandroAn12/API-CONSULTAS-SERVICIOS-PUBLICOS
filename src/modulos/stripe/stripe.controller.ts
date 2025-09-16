// src/payments/payments.controller.ts
import { Controller, Post, Body, Res, Get, Param } from '@nestjs/common';
import { Response } from 'express';
import { StripeService } from '../stripe/stripe.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body() body: { items: any[]; customerId?: string },
    @Res() res: Response,
  ) {
    try {
      const lineItems = body.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description,
          },
          unit_amount: item.price * 100, // Convertir a centavos
        },
        quantity: item.quantity,
      }));

      const session = await this.stripeService.createCheckoutSession(lineItems, body.customerId);

      res.json({ id: session.id, url: session.url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: { amount: number; currency?: string }) {
    try {
      const paymentIntent = await this.stripeService.createPaymentIntent(
        body.amount,
        body.currency,
      );

      return {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
      };
    } catch (error) {
      throw new Error(`Error creating payment intent: ${error.message}`);
    }
  }

  @Get('payment-intent/:id')
  async getPaymentIntent(@Param('id') id: string) {
    try {
      const paymentIntent = await this.stripeService.retrievePaymentIntent(id);
      return paymentIntent;
    } catch (error) {
      throw new Error(`Error retrieving payment intent: ${error.message}`);
    }
  }
}