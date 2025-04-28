import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, Length } from "class-validator";

export class ReportePagoDTO {
    @ApiProperty({ example: '17815784', description: 'Código de recaudación' })
    @IsNotEmpty({ message: 'El código no puede estar vacío' })
    codigoRecaudacion: string;
}