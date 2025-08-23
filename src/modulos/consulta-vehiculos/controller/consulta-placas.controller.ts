import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PlacaDTO } from "../dto/placa.dto";
import { PlacasService } from "../service/consulta-placas.service";
import { ReportePagoDTO } from "../dto/reportePagos.dto";
import { ApiKeyGuard } from "src/common/guards/apikey.guard";

@UseGuards(ApiKeyGuard)
@ApiTags('CONSULTA DE PLACAS')
@ApiBearerAuth('jwt-auth')
@Controller('placas')
export class ConsultaVehiculoController {

    constructor(private readonly placasService: PlacasService) { }

    @Get('consulta-placa')
    @ApiOperation({ summary: 'Consulta datos de un vehiculo por número de placa' })
    async consultarPorNumero(@Query() placaDto: PlacaDTO) {
        return this.placasService.obtenerDatosPorPlaca(placaDto);
    }

    @Get('pagos')
    @ApiOperation({ summary: 'Consulta reporte de pagos de vehiculo por placa' })
    async consultarReportePagos(@Query() placaDto: PlacaDTO) {
        return this.placasService.obtenerReportePagos(placaDto);
    }

    @Get('detalle-pagos')
    @ApiOperation({ summary: 'Consulta reporte de pagos a detalle del vehiculo' })
    async consultarPagosDetalle(@Query() reportePagoDTO: ReportePagoDTO) {
        return this.placasService.obtenerReportePagosDetalle(reportePagoDTO);
    }

    @Get('valores-pendientes')
    @ApiOperation({ summary: 'Consulta valores pendientes de un vehiculo por número de placa' })
    async consultarValoresPendientes(@Query() placaDto: PlacaDTO) {
        return this.placasService.obtenerValoresPendientes(placaDto);
    }
}