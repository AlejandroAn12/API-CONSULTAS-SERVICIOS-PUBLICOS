import { Injectable, Inject, HttpException, HttpStatus, BadRequestException, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';
import { CedulaNombresDTO } from '../dto/cedula-nombres.dto';

@Injectable()
export class CedulaService {

  private readonly dni_url = process.env.DNI_URL;
  // private readonly dni_info_url = process.env.DNI_INFO_URL;


  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) { }

  async getDatosPorCedula(cedula: string): Promise<any> {
    try {
      const response$ = this.httpService.get(
        `${this.dni_url}?name=${cedula}&_=${Date.now()}` // Genera timestamp dinámico
      );

      const response = await lastValueFrom(response$);

      // AxiosResponse trae { data, status, ... }
      const data = response.data;

      console.log('RESPONSE', response)

      if (data === '') {
        throw new NotFoundException('Información no encontrada')
      }
      //Parsear el response que viene desde el webservice 
      // y solo obtiene identificiacion - nombresCompletos
      return {
        data: {
          identificacion: data.contribuyente.identificacion,
          nombres_completos: data.contribuyente.nombreComercial,
        }
      }

    } catch (error) {

      if (error instanceof BadRequestException) {
        throw new BadRequestException('Error consultando los datos');
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        'Error al consultar los datos en linea',
        error?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // async getDatosNombres(dto: CedulaNombresDTO): Promise<any> {

  //   const { primerNombre, segundoNombre, primerApellido, segundoApellido } = dto;

  //   try {
  //     const response$ = this.httpService.get(
  //       `${this.dni_info_url}/${primerApellido}%20${segundoApellido}%20${primerNombre}%20${segundoNombre}?_=${Date.now()}`,
  //       {
  //         headers: {
  //           'x-sri-licencia': 'http://www.sri.gob.ec/documents/156146/0/Licencia+Aplicacion+Movil+y+Servicios+Relacionados.pdf',
  //           'Set-Cookie': 'TS01ed1cee=0115ac86d22cc173f759ced07bd9112e73325c6d16316244f758050acf073b3767086ebe5b5d995f72f78681992ade328fa258a16177344563e8b067d040c3110120dcc99d; Path=/; Domain=.srienlinea.sri.gob.ec;',
  //         }
  //       }
  //     );

  //     const response = await lastValueFrom(response$);
  //     console.log('data por nombres', response);

  //   } catch (error) {

  //     console.error('Error al consultar información', error?.response?.data || error);

  //     if (error instanceof BadRequestException) {
  //       throw new BadRequestException('Error consultando los datos');
  //     }
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     throw new HttpException(
  //       'Error al consultar los datos en linea',
  //       error?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}