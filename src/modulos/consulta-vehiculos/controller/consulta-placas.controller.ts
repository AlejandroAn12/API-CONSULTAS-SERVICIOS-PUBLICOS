import { BadRequestException, Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PlacaDTO } from "../dto/placa.dto";
import { PlacasService } from "../service/consulta-placas.service";
import { ReportePagoDTO } from "../dto/reportePagos.dto";
import { ApiKeyGuard } from "src/common/guards/apikey.guard";
import { MultasService } from "../service/multas.service";

@UseGuards(ApiKeyGuard)
@ApiTags('CONSULTA DE PLACAS')
@ApiBearerAuth('jwt-auth')
@Controller('placas')
export class ConsultaVehiculoController {

    constructor(
        private readonly placasService: PlacasService,
        private readonly multasService: MultasService) { }

    @Get('lite/:placa')
    @ApiOperation({ summary: 'Consulta datos de un vehiculo por número de placa' })
    async consultarPorNumeroLite(@Param('placa') placa: string) {
        placa.trim().toUpperCase();
        // Validación manual simple
        if (!placa || !/^[A-Z]{3}\d{4}$/.test(placa)) {
            throw new BadRequestException('La placa debe tener el formato AAA0000');
        }
        return this.placasService.datosPlacaLite(placa);
    }

    @Get('all/:placa')
    @ApiOperation({ summary: 'Consulta datos de un vehiculo por número de placa' })
    async consultarPorNumeroFull(@Param('placa') placa: string) {
        placa.trim().toUpperCase();
        // Validación manual simple
        if (!placa || !/^[A-Z]{3}\d{4}$/.test(placa)) {
            throw new BadRequestException('La placa debe tener el formato AAA0000');
        }
        return this.placasService.datosPlacaFull(placa);
    }

    @Get('pagos/:placa')
    @ApiOperation({ summary: 'Consulta reporte de pagos de vehiculo por placa' })
    async consultarReportePagos(@Param('placa') placa: string) {
        // Validación manual simple
        if (!placa || !/^[A-Z]{3}\d{4}$/.test(placa)) {
            throw new BadRequestException('La placa debe tener el formato AAA0000');
        }
        return this.placasService.obtenerReportePagos(placa);
    }

    @Get('pagos/detalle/:codRecaudacion')
    @ApiOperation({ summary: 'Consulta reporte de pagos a detalle del vehiculo' })
    async consultarPagosDetalle(@Param('codRecaudacion') codRecaudacion: number) {
        return this.placasService.obtenerReportePagosDetalle(codRecaudacion);
    }

    @Get('pagos/valorPendiente/:placa')
    @ApiOperation({ summary: 'Consulta valores pendientes de un vehiculo por número de placa' })
    async consultarValoresPendientes(@Param('placa') placa: string) {
        return this.placasService.obtenerValoresPendientes(placa);
    }


    @Get('multas/detalle')
    async obtenerDetalle(
        @Query('citacion') citacion: string,
        @Query('opcion') opcion = 'G',
    ) {
        return this.multasService.obtenerDetalles(citacion, opcion);
    }

    @Get('multas/pagadas/:placa')
    async consultarMultasPagadas(
        @Query('opcion') opcion = 'G',
        @Param('placa') placa: string,
    ) {
        return this.multasService.obtenerMultas(placa, opcion);
    }

    @Get('multas/pendientes/:placa')
    async consultarMultasPendientes(
        @Query('opcion') opcion = 'P',
        @Param('placa') placa: string,
    ) {
        return this.multasService.obtenerMultas(placa, opcion);
    }

}