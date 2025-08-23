import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SriCedulaService } from '../../consulta-cedula/services/consulta-cedula.service';
import { CedulaDTO } from '../../consulta-cedula/dto/cedula.dto';
import { CedulaNombresDTO } from '../dto/cedula-nombres.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesPermisosGuard } from 'src/common/guards/roles-permisos.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Role } from 'src/common/enums/role.enum';
// import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
import { ConsultaPublica } from 'src/common/decorators/consulta-publica.decorator';
import { ConsultaPublicaGuard } from 'src/common/guards/consulta-publica.guard';


@ApiTags('Servicio de Cédula')
@ApiBearerAuth('jwt-auth')
@Controller('servicio-cedula')
export class ConsultaCedulaController {

  constructor(private readonly cedulaService: SriCedulaService) { }

  // @Roles(Role.ADMINISTRADOR, Role.USUARIO_REGULAR, Role.USUARIO_PREMIUN)
  // @ConsultaPublica()
// @UseGuards(ConsultaPublicaGuard)
  @Get('consulta-numero')
  @ApiOperation({ summary: 'Consulta datos por número de cédula' })
  async consultarPorCedula(@Query('cedula') cedula: string) {
    console.log('controller', cedula)
    return this.cedulaService.getDatosPorCedula(cedula);
  }
  // async consultarPorNumero(@Query() cedulaDto: CedulaDTO) {
  //   return this.cedulaService.getDatosPorCedula(cedulaDto);
  // }

  //TODO:REVISAR ENDPOINTS DE CONSULTA DE DATOS POR NOMBRES Y APELLIDOS
  // @Roles(Role.ADMINISTRADOR, Role.USUARIO_REGULAR, Role.USUARIO_PREMIUN)
  // @Get('consulta-nombres')
  // @ApiOperation({ summary: 'Consulta datos por nombres y apellidos' })
  // async consultarPorNombres(@Query() cedulaNDTO: CedulaNombresDTO) {
  //   return this.cedulaService.obtenerDatosPorNombres(cedulaNDTO);
  // }

  // // @Roles(Role.ADMINISTRADOR, Role.USUARIO_REGULAR, Role.USUARIO_PREMIUN)
  // @Get('ruta-protegida')
  // findSomething() {
  //   return { message: 'Acceso concedido solo a usuarios válidos.' };
  // }

}
