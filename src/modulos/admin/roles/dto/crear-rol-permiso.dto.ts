import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CrearRolePermisoDto {
  @ApiProperty({ description: 'Id del rol', example: 'asds-asds155-58sa4sa-a5s2a1' })
  @IsNotEmpty({ message: 'El id del rol no puede estar vacío' })
  @IsString()
  rolId: string;

  @ApiProperty({ description: 'Id del permiso', example: 'asds-asds155-58sa4sa-a5s2a1' })
  @IsNotEmpty({ message: 'El id del permiso no puede estar vacío' })
  @IsString()
  permisoId: string;
}