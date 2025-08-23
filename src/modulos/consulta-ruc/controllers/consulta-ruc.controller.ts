import { Controller, Post, Body, Get, Query, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { SriRUCService } from '../services/consulta-ruc.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RUCDTO } from '../dto/ruc.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesPermisosGuard } from 'src/common/guards/roles-permisos.guard';
import { Public } from 'src/common/decorators/public.decorator';
// import { ApiKeyGuard } from 'src/common/guards/api-key.guard';

// @UseGuards(ApiKeyGuard)
@ApiTags('Servicio de RUC')
@ApiBearerAuth('jwt-auth')
@Controller('servicio-ruc')
export class ConsultaRucController {

  constructor(private readonly rucService: SriRUCService) { }

  // @Roles(Role.ADMINISTRADOR, Role.USUARIO_REGULAR, Role.USUARIO_PREMIUN)
  @Public()
  @Get('consulta-numero')
  @UsePipes(new ValidationPipe({ transform: true }))
  async consultarPorRuc(@Query() rucDto: RUCDTO) {
    return this.rucService.obtenerDatosPorRuc(rucDto);
  }
}