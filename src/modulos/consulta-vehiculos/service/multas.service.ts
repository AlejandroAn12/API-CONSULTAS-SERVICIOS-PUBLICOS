import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import axios from "axios";
import * as cheerio from 'cheerio';
import { firstValueFrom } from "rxjs";

@Injectable()
export class MultasService {

    constructor(private readonly httpService: HttpService,) { }
    private readonly urlCitaciones = process.env.URL_CITACIONES;
    private readonly urlDetalleCitaciones = process.env.URL_DETALLE_CITACIONES;

    async obtenerMultas(placa: string, opcion : string) {

        const regex = /^[A-Z]{3}\d{4}$/;
        if (!regex.test(placa)) {
            throw new Error('Formato de placa inválido. Debe ser AAA0000.');
        }
        try {
            const url = `${this.urlCitaciones}ps_opcion=${opcion}&ps_id_contrato=714103883&ps_id_persona=76125831&ps_placa=${placa}&ps_identificacion=${placa}&ps_tipo_identificacion=PLA&_search=false&nd=1758083805691&rows=50&page=1&sidx=fecha_emision&sord=desc`;

            const response = await firstValueFrom(this.httpService.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0' },

            }));
            console.log('DATA', response.data)
            return {
                data: response.data
            }

        } catch (error) {
            console.error('Error al obtener multas pagadas: ', error)
        }
    }

    async obtenerDetalles(idFactura: string, opcion = 'G') {
        try {
            const url = `${this.urlDetalleCitaciones}?ps_id_factura=${idFactura}&ps_opcion=${opcion}`;
            const { data: html } = await axios.get(url);

            const $ = cheerio.load(html);

            const getText = (label: string) =>
                $(`td:contains("${label}")`).next().text().trim();

            const data = {
                numero_citacion: getText('No. Citación:'),
                placa: getText('Placa:'),
                documento: getText('Documento:'),
                fecha_emision: getText('Fecha de Emisión:'),
                tipo: getText('Tipo:'),
                clase: getText('Clase:'),
                observacion: getText('Observación:'),
                rubro: getText('Rubro:'),
                entidad: getText('Entidad:'),
                puntos_perdidos: getText('Puntos Perdidos:'),
                agente: getText('Agente de Tránsito:'),
                lugar: getText('Lugar:'),
                provincia: getText('Provincia:'),
                localidad: getText('Localidad:'),
                zona: getText('Zona:'),
                distrito: getText('Distrito:'),
                circuito: getText('Circuito:'),
                origen: getText('Origen:'),
                tipo_final: $('td:contains("Tipo:")').last().next().text().trim(),
            };

            return data;
        } catch (error) {
            throw new HttpException(
                `Error al obtener datos: ${error.message}`,
                500,
            );
        }
    }
}