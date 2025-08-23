import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PlacaDTO } from "../dto/placa.dto";
import { SriPlacasService } from "../service/consulta-placas.service";
import { ReportePagoDTO } from "../dto/reportePagos.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesPermisosGuard } from "src/common/guards/roles-permisos.guard";
import { Role } from "src/common/enums/role.enum";
import { Roles } from "src/common/decorators/roles.decorator";

// @UseGuards(JwtAuthGuard, RolesPermisosGuard)
@ApiTags('Servicio Vehicular')
@ApiBearerAuth('jwt-auth')
@Controller('servicio-vehiculo')
export class ConsultaVehiculoController {

    constructor(private readonly sriplacasService: SriPlacasService) { }

    // @Roles(Role.ADMINISTRADOR, Role.USUARIO_REGULAR, Role.USUARIO_PREMIUN)
    @Get('consulta-placa')
    @ApiOperation({ summary: 'Consulta datos de un vehiculo por número de placa' })
    async consultarPorNumero(@Query() placaDto: PlacaDTO) {
        return this.sriplacasService.obtenerDatosPorPlaca(placaDto);
    }

    // @Roles(Role.ADMINISTRADOR, Role.USUARIO_REGULAR, Role.USUARIO_PREMIUN)
    @Get('reporte-pagos')
    @ApiOperation({ summary: 'Consulta reporte de pagos de vehiculo por placa' })
    async consultarReportePagos(@Query() placaDto: PlacaDTO) {
        return this.sriplacasService.obtenerReportePagos(placaDto);
    }

    // @Roles(Role.ADMINISTRADOR, Role.USUARIO_REGULAR, Role.USUARIO_PREMIUN)
    @Get('reporte-detalle-pagos')
    @ApiOperation({ summary: 'Consulta reporte de pagos a detalle del vehiculo' })
    async consultarPagosDetalle(@Query() reportePagoDTO: ReportePagoDTO) {
        return this.sriplacasService.obtenerReportePagosDetalle(reportePagoDTO);
    }

    // @Roles(Role.ADMINISTRADOR, Role.USUARIO_REGULAR, Role.USUARIO_PREMIUN)
    @Get('valores-pendientes')
    @ApiOperation({ summary: 'Consulta valores pendientes de un vehiculo por número de placa' })
    async consultarValoresPendientes(@Query() placaDto: PlacaDTO) {
        return this.sriplacasService.obtenerValoresPendientes(placaDto);
    }
}