// paypal/dto/recharge-balance.dto.ts
import { IsNumber, IsPositive, IsString, IsOptional } from 'class-validator';

export class RechargeBalanceDto {
    @IsNumber()
    @IsPositive({ message: 'El monto debe ser mayor a 0' })
    amount: number;

    @IsString()
    currency: string = 'USD';

    @IsString()
    @IsOptional()
    description?: string;
}