import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, Length } from "class-validator";

export class CedulaDTO {
     @ApiProperty({ description: 'Número de cedula', example: '0801223898' })
      @IsNotEmpty({ message: 'La cédula no puede estar vacío' })
      @IsString({ message: 'La cédula debe ser un string' })
      @Matches(/^\d+$/, { message: 'La cédula debe contener solo números' })
      @Length(10, 10, { message: 'La cédula debe tener exactamente 10 dígitos' })
      cedula: string;
}