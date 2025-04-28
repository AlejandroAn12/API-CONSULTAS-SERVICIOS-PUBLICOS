import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, Length } from "class-validator";

export class CodigoVehiculoDTO {
    @ApiProperty({ example: '17815784', description: 'Código del vehículo' })
    @IsNotEmpty({ message: 'El código no puede estar vacío' })
    codigoVehiculo: string;
}