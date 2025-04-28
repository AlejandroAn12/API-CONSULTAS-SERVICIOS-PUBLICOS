import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  Length,
} from 'class-validator';

export class RUCDTO {
  @ApiProperty({ description: 'Número de RUC', example: '1790016919001' })
  @IsNotEmpty({ message: 'El RUC no puede estar vacío' })
  @IsString({ message: 'El RUC debe ser un string' })
  @Matches(/^\d+$/, { message: 'El RUC debe contener solo números' })
  @Length(13, 13, { message: 'El RUC debe tener exactamente 13 dígitos' })
  ruc: string;
}