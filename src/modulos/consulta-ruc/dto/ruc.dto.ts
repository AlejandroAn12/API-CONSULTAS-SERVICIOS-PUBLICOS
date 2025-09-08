import { IsNotEmpty, IsNumber, IsString, Length, Matches } from 'class-validator';

export class RUCDTO {
  @IsNotEmpty({ message: 'El RUC no puede estar vacío' })
  @Matches(/^\d+$/, { message: 'El RUC debe contener solo números' })
  @Length(13, 13, { message: 'El RUC debe tener exactamente 13 dígitos' })
  ruc: string;
}