import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class IRegister {
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
    // planId: string;

    // @IsNumber()
    // timeZoneId: number;
}