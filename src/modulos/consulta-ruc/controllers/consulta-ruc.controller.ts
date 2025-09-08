import { Controller, Get, Query, UsePipes, ValidationPipe, UseGuards, Param, BadRequestException } from '@nestjs/common';
import { RUCService } from '../services/consulta-ruc.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RUCDTO } from '../dto/ruc.dto';
import { ApiKeyGuard } from 'src/common/guards/apikey.guard';

@UseGuards(ApiKeyGuard)
@ApiTags('CONSULTA DE RUC')
@ApiBearerAuth('jwt-auth')
@Controller('ruc')
export class ConsultaRucController {

  constructor(private readonly rucService: RUCService) { }

  @Get(':ruc')
async consultarPorRuc(@Param('ruc') ruc: string) {
  // Validación manual simple
  if (!ruc || !/^\d{13}$/.test(ruc)) {
    throw new BadRequestException('RUC debe tener exactamente 13 dígitos numéricos');
  }
  
  return this.rucService.obtenerDatosPorRuc(ruc);
}
}