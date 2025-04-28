import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PlacaDTO } from "../dto/placa.dto";
import { SriPlacasService } from "../service/consulta-placas.service";
import { ReportePagoDTO } from "../dto/reportePagos.dto";

@ApiTags('Servicio Vehicular')
@ApiBearerAuth('jwt-auth')
@Controller('servicio-vehiculo')
export class ConsultaVehiculoController {

    constructor(private readonly sriplacasService: SriPlacasService) { }

    @Get('consulta-placa')
    @ApiOperation({ summary: 'Consulta datos de un vehiculo por número de placa' })
    async consultarPorNumero(@Query() placaDto: PlacaDTO) {
        return this.sriplacasService.obtenerDatosPorPlaca(placaDto);
    }

    @Get('reporte-pagos')
    @ApiOperation({ summary: 'Consulta reporte de pagos de vehiculo por placa' })
    async consultarReportePagos(@Query() placaDto: PlacaDTO) {
        return this.sriplacasService.obtenerReportePagos(placaDto);
    }

    @Get('reporte-detalle-pagos')
    @ApiOperation({ summary: 'Consulta reporte de pagos a detalle del vehiculo' })
    async consultarPagosDetalle(@Query() reportePagoDTO: ReportePagoDTO) {
        return this.sriplacasService.obtenerReportePagosDetalle(reportePagoDTO);
    }


    @Get('valores-pendientes')
    @ApiOperation({ summary: 'Consulta valores pendientes de un vehiculo por número de placa' })
    async consultarValoresPendientes(@Query() placaDto: PlacaDTO) {
        return this.sriplacasService.obtenerValoresPendientes(placaDto);
    }
}