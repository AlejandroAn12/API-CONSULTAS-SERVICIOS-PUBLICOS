import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, IsOptional } from "class-validator";

export class CedulaNombresDTO {
  
    @ApiProperty({
        description: 'Primer nombre de la persona',
        example: 'Juan',
      })
      @IsString({ message: 'El primer nombre debe ser un texto' })
      @IsNotEmpty({ message: 'El primer nombre no puede estar vacío' })
      primerNombre: string;
    
      @ApiProperty({
        description: 'Segundo nombre de la persona',
        example: 'Camilo',
        required: true,
      })
      @IsString({ message: 'El segundo nombre debe ser un texto' })
      segundoNombre?: string;
    
      @ApiProperty({
        description: 'Primer apellido de la persona',
        example: 'Trujillo',
      })
      @IsString({ message: 'El primer apellido debe ser un texto' })
      @IsNotEmpty({ message: 'El primer apellido no puede estar vacío' })
      primerApellido: string;
    
      @ApiProperty({
        description: 'Segundo apellido de la persona',
        example: 'Perea',
        required: false,
      })
      @IsString({ message: 'El segundo apellido debe ser un texto' })
      segundoApellido?: string;
}