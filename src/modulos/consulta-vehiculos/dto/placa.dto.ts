import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, Length } from "class-validator";

export class PlacaDTO {
    @ApiProperty({ example: 'ABC1234', description: 'Número de placa del vehículo' })
    @IsNotEmpty({ message: 'La placa no puede estar vacía' })
    @Matches(/^[A-Z]{3}\d{4}$/, { message: 'La placa debe tener el formato AAA0000' })
    placa: string;
}