import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UsuarioDTO {
    @ApiProperty({ description: 'Nombres', example: 'Juan Fernando' })
    @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
    nombres: string;

    @ApiProperty({ description: 'Email', example: 'example@example.com' })
    @IsNotEmpty({ message: 'El email no puede estar vacío' })
    email: string;

    @ApiProperty({ description: 'Password', example: '*********' })
    @IsNotEmpty({ message: 'El password no puede estar vacío' })
    password: string;

    // @IsString()
    // rol: string;

    @IsString()
    system: string;
}