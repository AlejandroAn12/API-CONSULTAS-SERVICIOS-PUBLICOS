// paypal/paypal.service.ts
import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as paypal from '@paypal/checkout-server-sdk';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaypalService {
    private client: paypal.core.PayPalHttpClient;

    constructor(
        @Inject('PAYPAL_CONFIG') private readonly config: any,
        private readonly httpService: HttpService,
        private readonly prisma: PrismaService,
    ) {
        this.initializePaypalClient();
    }

    private initializePaypalClient() {
        const environment = this.config.environment === 'production'
            ? new paypal.core.LiveEnvironment(
                this.config.clientId,
                this.config.clientSecret
            )
            : new paypal.core.SandboxEnvironment(
                this.config.clientId,
                this.config.clientSecret
            );

        this.client = new paypal.core.PayPalHttpClient(environment);
    }

    // Crear orden de recarga y guardar en base de datos
    // `${this.config.frontendUrl}/recarga/exito?usuarioId=${usuarioId}`
    async createRechargeOrder(usuarioId: string, rechargeData: {
        amount: number;
        currency: string;
        description?: string;
    }): Promise<any> {
        try {
            if (rechargeData.amount <= 0) {
                throw new BadRequestException('El monto debe ser mayor a 0');
            }

            const request = new paypal.orders.OrdersCreateRequest();
            request.prefer('return=representation');

            request.requestBody({
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: rechargeData.currency,
                        value: rechargeData.amount.toFixed(2),
                    },
                    description: rechargeData.description || `Recarga de saldo`,
                    custom_id: usuarioId,
                }],
                application_context: {
                    brand_name: this.config.brandName,
                    landing_page: 'BILLING',
                    user_action: 'PAY_NOW',
                    return_url: `${this.config.frontendUrl}/d/dashboard`,
                    cancel_url: `${this.config.frontendUrl}/recarga/cancelada`,
                }
            });

            const response = await this.client.execute(request);
            const order = response.result;

            // Guardar la orden en base de datos
            await this.prisma.paypalOrder.create({
                data: {
                    orderId: order.id,
                    usuarioId: usuarioId,
                    amount: rechargeData.amount,
                    currency: rechargeData.currency,
                    status: 'CREATED',
                    approvalUrl: order.links.find(link => link.rel === 'approve').href,
                }
            });

            return order;

        } catch (error) {
            throw new Error(`Error creating recharge order: ${error.message}`);
        }
    }

    // Verificar y capturar orden
    async verifyAndCaptureOrder(orderId: string): Promise<any> {
        try {

            // Verificar si la orden existe en nuestra DB
            const dbOrder = await this.prisma.paypalOrder.findUnique({
                where: { orderId }
            });

            if (!dbOrder) {
                throw new Error('Orden no encontrada');
            }

            const usuarioExisteDB = await this.prisma.usuario.findUnique({
                where: {id: dbOrder.usuarioId}
            });

            if(!usuarioExisteDB){
                throw new BadRequestException('El usuario asociado a la orden no existe, no se puede procesar la recarga');
            }

            // if (dbOrder.usuarioId !== usuarioId) {
            //     throw new Error('No autorizado para esta orden');
            // }

            if (dbOrder.status === 'COMPLETED') {
                throw new Error('Esta orden ya fue procesada');
            }


            // Primero verificar el estado de la orden
            const orderDetails = await this.getOrderDetails(orderId);

            if (orderDetails.status !== 'APPROVED') {
                throw new Error('La orden no ha sido aprobada por el usuario');
            }

            // Capturar el pago
            const captureRequest = new paypal.orders.OrdersCaptureRequest(orderId);
            captureRequest.prefer('return=representation');

            const captureResponse = await this.client.execute(captureRequest);
            const captureResult = captureResponse.result;

            if (captureResult.status !== 'COMPLETED') {
                throw new Error('El pago no fue completado');
            }

            // Procesar la recarga
            const purchaseUnit = captureResult.purchase_units[0];
            const monto = parseFloat(purchaseUnit.amount.value);
            const currency = purchaseUnit.amount.currency_code;

            const recarga = await this.procesarRecarga(
                dbOrder.usuarioId ?? '',
                monto,
                `Recarga PayPal - Order: ${orderId}`
            );

            // Actualizar estado en base de datos
            await this.prisma.paypalOrder.update({
                where: { orderId },
                data: {
                    status: 'COMPLETED',
                    captureId: captureResult.id,
                    capturedAt: new Date()
                }
            });

            return {
                success: true,
                capture: captureResult,
                recarga
            };

        } catch (error) {
            // Actualizar estado a error
            await this.prisma.paypalOrder.update({
                where: { orderId },
                data: { status: 'FAILED', error: error.message }
            });

            throw new Error(`Error capturing payment: ${error.message}`);
        }
    }

    // Capturar y procesar una orden (usado por webhook o manual)
    // async captureAndProcessOrder(orderId: string, usuarioId: string) {
    //     const dbOrder = await this.findOrderInDB(orderId);

    //     console.log('ORDEN DE LA BASE DE DATOS => ', dbOrder)

    //     if (!dbOrder) throw new Error('Orden no encontrada');
    //     if (dbOrder.status === 'COMPLETED') return dbOrder;

    //     // Capturar pago en PayPal
    //     const captureRequest = new paypal.orders.OrdersCaptureRequest(orderId);
    //     captureRequest.prefer('return=representation');

    //     const captureResponse = await this.client.execute(captureRequest);
    //     const captureResult = captureResponse.result;

    //     if (captureResult.status !== 'COMPLETED') {
    //         throw new Error('Pago no completado');
    //     }

    //     // Procesar recarga
    //     const purchaseUnit = captureResult.purchase_units[0];
    //     const monto = parseFloat(purchaseUnit.amount.value);
    //     const currency = purchaseUnit.amount.currency_code;

    //     const recarga = await this.procesarRecarga(
    //         usuarioId,
    //         monto,
    //         `Recarga PayPal - Order ${orderId}`
    //     );

    //     // Actualizar DB
    //     await this.prisma.paypalOrder.update({
    //         where: { orderId },
    //         data: {
    //             status: 'COMPLETED',
    //             captureId: captureResult.id,
    //             capturedAt: new Date(),
    //         },
    //     });

    //     return { capture: captureResult, recarga };
    // }


    // Método para procesar la recarga en la base de datos
    private async procesarRecarga(usuarioId: string, monto: number, descripcion: string) {
        if (monto <= 0) throw new BadRequestException('El monto debe ser mayor a 0');

        return this.prisma.$transaction(async (tx) => {
            const wallet = await tx.wallet.upsert({
                where: { usuarioId },
                update: { balance: { increment: monto } },
                create: { usuarioId, balance: monto },
            });

            await tx.transaccion.create({
                data: {
                    tipo: 'RECARGA PAYPAL',
                    monto,
                    descripcion,
                    walletId: wallet.id,
                    //   metadata: {
                    //     metodo: 'PayPal',
                    //     fecha: new Date().toISOString()
                    //   }
                },
            });

            return wallet;
        });
    }

    // Obtener detalles de la orden
    async getOrderDetails(orderId: string): Promise<any> {
        try {
            const request = new paypal.orders.OrdersGetRequest(orderId);
            const response = await this.client.execute(request);
            return response.result;
        } catch (error) {
            throw new Error(`Error getting order details: ${error.message}`);
        }
    }

    // Buscar orden en base de datos
    async findOrderInDB(orderId: string) {
        return this.prisma.paypalOrder.findUnique({
            where: { orderId },
        });
    }

    // Refund de pago (reembolso)
    async refundRecharge(captureId: string, amount?: number): Promise<any> {
        try {
            const request = new paypal.payments.CapturesRefundRequest(captureId);

            const refundBody: any = {};
            if (amount) {
                refundBody.amount = {
                    value: amount.toFixed(2),
                    currency_code: 'USD'
                };
            }

            request.requestBody(refundBody);

            const response = await this.client.execute(request);
            return response.result;
        } catch (error) {
            throw new Error(`Error refunding payment: ${error.message}`);
        }
    }
}