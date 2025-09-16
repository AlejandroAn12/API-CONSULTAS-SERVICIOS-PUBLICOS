// paypal/dto/create-order.dto.ts
import { IsNumber, IsString, IsOptional, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class UnitAmountDto {
  @IsString()
  currency_code: string;

  @IsString()
  value: string;
}

class OrderItemDto {
  @IsString()
  name: string;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => UnitAmountDto)
  unit_amount: UnitAmountDto;
}

export class CreateOrderDto {
  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsOptional()
  items?: OrderItemDto[];
}