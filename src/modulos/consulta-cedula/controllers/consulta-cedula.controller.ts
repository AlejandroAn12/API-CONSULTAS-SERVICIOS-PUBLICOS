import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CedulaService } from '../../consulta-cedula/services/consulta-cedula.service';
import { ApiKeyGuard } from 'src/common/guards/apikey.guard';
import { CedulaNombresDTO } from '../dto/cedula-nombres.dto';


@UseGuards(ApiKeyGuard)
@ApiTags('CONSULTA DE CEDULA')
@ApiBearerAuth('jwt-auth')
@Controller('cedula')
export class ConsultaCedulaController {

  constructor(private readonly cedulaService: CedulaService) { }

  @Get(':nit')
  @ApiOperation({ summary: 'Consulta datos por número de cédula' })
  async consultarPorCedula(@Param('nit') cedula: string) {
    console.log('controller', cedula)
    return this.cedulaService.getDatosPorCedula(cedula);
  }

}
