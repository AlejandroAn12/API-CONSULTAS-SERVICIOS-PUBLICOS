import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class PermisoDTO {

    @ApiProperty({ description: 'Nombre', example: 'Activa' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
    nombre: string;

    @ApiProperty({ description: 'Descripción', example: 'Descripción a detalle' })
    @IsNotEmpty({ message: 'La descripción no puede estar vacío' })
    descripcion?: string;
}