import { Controller, Post, Body, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { SriRUCService } from '../services/consulta-ruc.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RUCDTO } from '../dto/ruc.dto';

@ApiTags('Servicio de RUC')
@ApiBearerAuth('jwt-auth')
@Controller('servicio-ruc')
export class ConsultaRucController {

  constructor(private readonly rucService: SriRUCService) { }

  @Get('consulta-numero')
  @UsePipes(new ValidationPipe({ transform: true }))
  async consultarPorRuc(@Query() rucDto: RUCDTO ){
    return this.rucService.obtenerDatosPorRuc(rucDto);
  }
}