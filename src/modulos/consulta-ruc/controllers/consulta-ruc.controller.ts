import { Controller, Post, Body, Get, Query, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { RUCService } from '../services/consulta-ruc.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RUCDTO } from '../dto/ruc.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiKeyGuard } from 'src/common/guards/apikey.guard';

@UseGuards(ApiKeyGuard)
@ApiTags('CONSULTA DE RUC')
@ApiBearerAuth('jwt-auth')
@Controller('ruc')
export class ConsultaRucController {

  constructor(private readonly rucService: RUCService) { }

  // @Roles(Role.ADMINISTRADOR, Role.USUARIO_REGULAR, Role.USUARIO_PREMIUN)
  @Public()
  @Get('consulta')
  @UsePipes(new ValidationPipe({ transform: true }))
  async consultarPorRuc(@Query() rucDto: RUCDTO) {
    return this.rucService.obtenerDatosPorRuc(rucDto);
  }
}