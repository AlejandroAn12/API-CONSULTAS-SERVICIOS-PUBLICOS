import { HttpService } from "@nestjs/axios";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from "@nestjs/common";
import { PlacaDTO } from "../dto/placa.dto";
import { firstValueFrom } from "rxjs";
import { ReportePagoDTO } from "../dto/reportePagos.dto";

@Injectable()
export class SriPlacasService {
    private readonly urlExistePlaca =
        'https://srienlinea.sri.gob.ec/sri-matriculacion-vehicular-recaudacion-servicio-internet/rest/BaseVehiculo/existePorNumeroPlaca';

    private readonly urlDatosPlaca =
        'https://srienlinea.sri.gob.ec/sri-matriculacion-vehicular-recaudacion-servicio-internet/rest/BaseVehiculo/obtenerPorNumeroPlacaOPorNumeroCampvOPorNumeroCpn';

    private readonly urlReportePago =
        'https://srienlinea.sri.gob.ec/sri-matriculacion-vehicular-recaudacion-servicio-internet/rest/consultaPagos/obtenerPorPlacaCampvCpn';

    private readonly urlReportePagoDetalle =
        'https://srienlinea.sri.gob.ec/sri-matriculacion-vehicular-recaudacion-servicio-internet/rest/consultaPagos/obtenerDetallesPago';

    private readonly urlValoresPendientes = 'https://srienlinea.sri.gob.ec/sri-matriculacion-vehicular-recaudacion-servicio-internet/rest/ConsultaRubros/obtenerPorCodigoVehiculo';

    constructor(
        private readonly httpService: HttpService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) { }

    // Método para obtener datos de un vehículo por su placa
    // 1. Verificar existencia de la placa en el SRI
    async obtenerDatosPorPlaca(placaDto: PlacaDTO): Promise<{ existe: string; data: any }> {
        const placa = placaDto.placa.trim().toUpperCase();

        const regex = /^[A-Z]{3}\d{4}$/;
        if (!regex.test(placa)) {
            throw new Error('Formato de placa inválido. Debe ser AAA0000.');
        }

        const cacheKey = `sri:placa:${placa}`;
        const cached = await this.cacheManager.get<{ existe: string; data: any }>(cacheKey);

        if (cached) {
            console.log(`📦 Cache hit para Placa: ${placa}`);
            return cached;
        }

        try {
            // 1. Verificar existencia
            const url = `${this.urlExistePlaca}?numeroPlaca=${placa}`;
            const response = await firstValueFrom(
                this.httpService.get(url, {
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                }),
            );

            if (response.data?.mensaje !== 'La placa existe') {
                const result = { existe: 'La placa no existe en el sistema del SRI', data: null };
                await this.cacheManager.set(cacheKey, result, 60 * 10);
                return result;
            }

            // 2. Obtener datos
            const url2 = `${this.urlDatosPlaca}?numeroPlacaCampvCpn=${placa}`;
            const response2 = await firstValueFrom(
                this.httpService.get(url2, {
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                }),
            );

            const result = { existe: 'Ok', data: response2.data };
            await this.cacheManager.set(cacheKey, result, 60 * 10);
            return result;

        } catch (error) {
            console.error('❌ Error al consultar el SRI:', error.message);
            return { existe: 'Error al consultar el SRI', data: null };
        }
    }

    // Método para obtener el reporte de pagos de un vehículo por su placa
    // 1. Verificar existencia de la placa en el SRI
    async obtenerReportePagos(placaDto: PlacaDTO): Promise<any> {
        const placa = placaDto.placa.trim().toUpperCase();

        const regex = /^[A-Z]{3}\d{4}$/;
        if (!regex.test(placa)) {
            throw new Error('Formato de placa inválido. Debe ser AAA0000.');
        }

        const cacheKey = `sri:placa:${placa}`;
        const cached = await this.cacheManager.get<{ existe: string; data: any }>(cacheKey);

        if (cached) {
            console.log(`📦 Cache hit para Placa: ${placa}`);
            return cached;
        }

        try {
            // 1. Verificar existencia
            const urlExistePlaca = `${this.urlExistePlaca}?numeroPlaca=${placa}`;
            const response = await firstValueFrom(
                this.httpService.get(urlExistePlaca, {
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                }),
            );

            if (response.data?.mensaje !== 'La placa existe') {
                const result = { existe: 'La placa no existe en el sistema del SRI', data: null };
                await this.cacheManager.set(cacheKey, result, 60 * 10);
                return result;
            }

            // 2. Obtener datos
            const urlReportePagos = `${this.urlReportePago}?placaCampvCpn=${placa}`;
            const response2 = await firstValueFrom(
                this.httpService.get(urlReportePagos, {
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                }),
            );

            const result = { existe: 'Ok', data: response2.data };
            await this.cacheManager.set(cacheKey, result, 60 * 10);
            return result;

        } catch (error) {
            console.error('❌ Error al consultar el SRI:', error.message);
            return { existe: 'Error al consultar el SRI', data: null };
        }
    }

    // Método para obtener el reporte de pagos a detalle de un vehículo por su código de recaudación
    // 1. Verificar existencia de la placa en el SRI
    async obtenerReportePagosDetalle(reportePagoDTO: ReportePagoDTO): Promise<any> {
        const { codigoRecaudacion } = reportePagoDTO;

        try {
            const urlReportePagosDetalle = `${this.urlReportePagoDetalle}?codigoRecaudacion=${codigoRecaudacion}`;
            console.log('URL Detalle:', urlReportePagosDetalle);

            const response2 = await firstValueFrom(
                this.httpService.get(urlReportePagosDetalle, {
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                }),
            );

            if (response2.data?.mensajeServidor?.texto !== 'ok') {
                return { existe: 'Respuesta inválida del SRI', data: null };
            }

            const result = { existe: 'Ok', data: response2.data };
            console.log('Resultado Detalle:', result);
            return result;

        } catch (error) {
            console.error('❌ Error al consultar el SRI:', error.message);
            return { existe: 'Error al consultar el SRI', data: null };
        }
    }

    // Método para obtener los valores pendientes de un vehículo por su placa
    // 1. Verificar existencia de la placa en el SRI
    async obtenerValoresPendientes(placaDto: PlacaDTO): Promise<any> {
        const placa = placaDto.placa.trim().toUpperCase();

        const regex = /^[A-Z]{3}\d{4}$/;
        if (!regex.test(placa)) {
            throw new Error('Formato de placa inválido. Debe ser AAA0000.');
        }

        const cacheKey = `sri:placa:${placa}`;
        const cached = await this.cacheManager.get<{ existe: string; data: any }>(cacheKey);

        if (cached) {
            console.log(`📦 Cache hit para Placa: ${placa}`);
            return cached;
        }

        try {
            // 1. Verificar existencia
            const url = `${this.urlExistePlaca}?numeroPlaca=${placa}`;
            const response = await firstValueFrom(
                this.httpService.get(url, {
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                }),
            );

            if (response.data?.mensaje !== 'La placa existe') {
                const result = { existe: 'La placa no existe en el sistema del SRI', data: null };
                await this.cacheManager.set(cacheKey, result, 60 * 10);
                return result;
            }

            // 2. Obtener datos
            const url2 = `${this.urlDatosPlaca}?numeroPlacaCampvCpn=${placa}`;
            const response2 = await firstValueFrom(
                this.httpService.get(url2, {
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                }),
            );


            const result = { existe: 'Ok', data: response2.data };
            await this.cacheManager.set(cacheKey, result, 60 * 10);

            const codVehiculo = result.data.codigoVehiculo;


            const urlValoresPendientes = `${this.urlValoresPendientes}?codigoVehiculo=${codVehiculo}`;
            const response3 = await firstValueFrom(
                this.httpService.get(urlValoresPendientes, {
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                }),
            );

            if (response3.data?.mensajeServidor?.texto !== 'ok') {
                return { existe: 'Respuesta inválida del SRI', data: null };
            }
            if (response3.data?.mensajeServidor?.texto === 'No existen valores pendientes') {
                return { existe: 'No existen valores pendientes', data: null };
            }

            const resultValoresPendientes = { existe: 'Ok', data: response3.data };
            await this.cacheManager.set(cacheKey, result, 60 * 10);
            return resultValoresPendientes;

        } catch (error) {
            console.error('❌ Error al consultar el SRI:', error.message);
            return { existe: 'Error al consultar el SRI', data: null };
        }
    }

}
