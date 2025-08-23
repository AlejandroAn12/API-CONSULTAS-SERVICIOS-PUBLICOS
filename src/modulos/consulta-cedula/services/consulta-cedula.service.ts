import { Injectable, Inject,HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CedulaService {

private readonly url = process.env.DNI_URL;

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) { }

  async getDatosPorCedula(cedula: string): Promise<any> {
    try {
      const response$ = this.httpService.get(
        `${this.url}?name=${cedula}&_=${Date.now()}` // Genera timestamp dinámico
      );

      const response = await lastValueFrom(response$);

      // AxiosResponse trae { data, status, ... }
      const data = response.data;

      //Parsear el response que viene desde el webservice 
      // y solo obtiene identificiacion - nombresCompletos
      return {
        identificacion: data.contribuyente.identificacion,
        nombrescompletos: data.contribuyente.nombreComercial,
      }

    } catch (error) {
      
      console.error('Error al consultar información', error?.response?.data || error);

      if(error instanceof BadRequestException){
        throw new BadRequestException('Error consultando los datos');
      }
      throw new HttpException(
        'Error al consultar los datos en el SRI',
        error?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}