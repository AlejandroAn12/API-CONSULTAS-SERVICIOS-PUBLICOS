import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RolDTO {
    @ApiProperty({ description: 'Nombre', example: 'Activa' })
    @IsNotEmpty({ message: 'El nombre del rol no puede estar vacío' })
    nombre: string;
}