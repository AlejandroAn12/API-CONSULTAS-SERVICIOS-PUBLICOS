// src/stripe/stripe.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY') ?? (() => { throw new Error('STRIPE_SECRET_KEY is not defined'); })(),
      {
        apiVersion: '2025-08-27.basil', // Usa la versión más reciente
      },
    );
  }

  // Crear un cliente
  async createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    return this.stripe.customers.create({
      email,
      name,
    });
  }

  // Crear sesión de checkout
  async createCheckoutSession(
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
    customerId?: string,
    successUrl?: string,
    cancelUrl?: string,
  ): Promise<Stripe.Checkout.Session> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer: customerId,
      success_url: successUrl || `${this.configService.get('FRONTEND_URL')}/success`,
      cancel_url: cancelUrl || `${this.configService.get('FRONTEND_URL')}/cancel`,
    });

    return session;
  }

  // Crear intención de pago
  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata: any = {},
  ): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
  }

  // Obtener información de un pago
  async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.retrieve(paymentIntentId);
  }

  // Crear producto
  async createProduct(name: string, description?: string): Promise<Stripe.Product> {
    return this.stripe.products.create({
      name,
      description,
    });
  }

  // Crear precio
  async createPrice(
    productId: string,
    unitAmount: number,
    currency: string = 'usd',
  ): Promise<Stripe.Price> {
    return this.stripe.prices.create({
      product: productId,
      unit_amount: unitAmount,
      currency,
    });
  }

  // Webhook handler
  constructEvent(payload: Buffer, signature: string, secret: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(payload, signature, secret);
  }
}