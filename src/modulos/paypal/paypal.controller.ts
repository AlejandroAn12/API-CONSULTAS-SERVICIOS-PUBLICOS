// paypal/paypal.controller.ts
import { Controller, Post, Body, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RechargeBalanceDto } from './dto/recharge-balance.dto';

@UseGuards(JwtAuthGuard)
@Controller('paypal')
export class PaypalController {
    constructor(private readonly paypalService: PaypalService) { }
    @Post('recharge/create-order')
    async createRechargeOrder(
        @Req() req,
        @Body() rechargeData: RechargeBalanceDto
    ) {
        try {
            const usuarioId = req.user.sub;

            const order = await this.paypalService.createRechargeOrder(usuarioId, {
                amount: rechargeData.amount,
                currency: rechargeData.currency,
                description: rechargeData.description
            });

            return {
                success: true,
                orderId: order.id,
                approvalUrl: order.links.find(link => link.rel === 'approve').href,
                amount: rechargeData.amount,
                currency: rechargeData.currency
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    @Post('recharge/capture/:orderId')
    async captureAndRecharge(
        @Param('orderId') orderId: string,
        @Req() req
    ) {
        try {
            const usuarioId = req.user.sub;
            const result = await this.paypalService.verifyAndCaptureOrder(orderId, usuarioId);

            return {
                success: true,
                message: 'Recarga procesada exitosamente',
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Nuevo endpoint para verificar estado
    @Get('order/:orderId/status')
    async getOrderStatus(@Param('orderId') orderId: string) {
        try {
            const order = await this.paypalService.getOrderDetails(orderId);
            return {
                success: true,
                status: order.status,
                order
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Endpoint para frontend después de aprobación
    @Get('recharge/success')
    async handleSuccess(
        @Query('token') orderId: string,
        @Query('PayerID') payerId: string,
        @Query('usuarioId') usuarioId: string
    ) {
        try {
            // Verificar que la orden está aprobada
            const order = await this.paypalService.getOrderDetails(orderId);

            if (order.status === 'APPROVED') {
                // Capturar automáticamente
                const result = await this.paypalService.verifyAndCaptureOrder(orderId, usuarioId);

                return {
                    success: true,
                    message: '¡Recarga exitosa!',
                    data: result
                };
            }

            return {
                success: false,
                error: 'La orden no está aprobada'
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    @Post('refund/:captureId')
    async refundPayment(
        @Param('captureId') captureId: string,
        @Body() refundData: { amount?: number }
    ) {
        try {
            const refund = await this.paypalService.refundRecharge(
                captureId,
                refundData.amount
            );
            return {
                success: true,
                refund
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}