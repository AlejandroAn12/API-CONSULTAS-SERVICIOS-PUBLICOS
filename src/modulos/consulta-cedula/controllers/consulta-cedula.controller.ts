import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CedulaService } from '../../consulta-cedula/services/consulta-cedula.service';
import { ApiKeyGuard } from 'src/common/guards/apikey.guard';

@UseGuards(ApiKeyGuard)
@ApiTags('CONSULTA DE CEDULA')
@ApiBearerAuth('jwt-auth')
@Controller('dni')
export class ConsultaCedulaController {

  constructor(private readonly cedulaService: CedulaService) { }

  // @Roles(Role.ADMINISTRADOR, Role.USUARIO_REGULAR, Role.USUARIO_PREMIUN)
  @Get('')
  @ApiOperation({ summary: 'Consulta datos por número de cédula' })
  async consultarPorCedula(@Query('cedula') cedula: string) {
    console.log('controller', cedula)
    return this.cedulaService.getDatosPorCedula(cedula);
  }

}
