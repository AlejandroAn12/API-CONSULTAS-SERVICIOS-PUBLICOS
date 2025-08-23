import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CrearUsuarioRolDto {

    @ApiProperty({ description: 'Id del usuario', example: 'asds-asds155-58sa4sa-a5s2a1' })
    @IsNotEmpty({ message: 'El del usuario no puede estar vacío' })
    usuarioId: string;

    @ApiProperty({ description: 'Id del rol', example: 'asds-asds155-58sa4sa-a5s2a1' })
    @IsNotEmpty({ message: 'El id del rol no puede estar vacío' })
    rolId: string;
}