import { Controller, Post, Body, Get, Query, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SriCedulaService } from '../../consulta-cedula/services/consulta-cedula.service';
import { CedulaDTO } from '../../consulta-cedula/dto/cedula.dto';
import { CedulaNombresDTO } from '../dto/cedula-nombres.dto';
import { ApiKeyGuard } from 'src/modulos/admin/auth/guards/api-key.guard';
import { JwtAuthGuard } from 'src/modulos/admin/auth/guards/jwt-auth.guard';

@ApiTags('Servicio de Cédula')
@ApiBearerAuth('jwt-auth')
@Controller('servicio-cedula')
export class ConsultaCedulaController {

  constructor(private readonly cedulaService: SriCedulaService) { }

  @UseGuards(ApiKeyGuard, JwtAuthGuard)
  @Get('consulta-numero')
  @ApiOperation({ summary: 'Consulta datos por número de cédula' })
  async consultarPorNumero(@Query() cedulaDto: CedulaDTO) {
    return this.cedulaService.obtenerDatosPorCedula(cedulaDto);
  }

  @Get('consulta-nombres')
  @ApiOperation({ summary: 'Consulta datos por nombres y apellidos' })
  async consultarPorNombres(@Query() cedulaNDTO: CedulaNombresDTO) {
    return this.cedulaService.obtenerDatosPorNombres(cedulaNDTO);
  }

  @UseGuards(ApiKeyGuard, JwtAuthGuard)
  @Get('ruta-protegida')
  findSomething() {
    return { message: 'Acceso concedido solo a usuarios válidos.' };
  }

}
