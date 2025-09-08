import { Injectable, Inject, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { firstValueFrom, NotFoundError } from 'rxjs';
import { RUCDTO } from '../dto/ruc.dto';

@Injectable()
export class RUCService {
  private readonly baseUrl = process.env.RUC_URL1;
  private readonly baseUrl2 = process.env.RUC_URL_EXISTE;

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) { }

  async obtenerDatosPorRuc(ruc: string): Promise<{ existe: boolean; data: any }> {

    // const { ruc } = rucDTO;
    const cacheKey = `sri:ruc:${ruc}`;
    const cached = await this.cacheManager.get<{ existe: boolean; data: any }>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const urlExiste = `${this.baseUrl2}?numeroRuc=${ruc}`;
      const existeResponse = await firstValueFrom(this.httpService.get(urlExiste));
      const existe = existeResponse.data === true;

      if (!existe) {
        throw new NotFoundException({
          statusCode: 404,
          message: 'Información no encontrada',
          errorCode:'DATA_NOT_FOUND'
        })
      }

      const url = `${this.baseUrl}?ruc=${ruc}`;

      const response = await firstValueFrom(this.httpService.get(url));

      const result = { existe: true, data: response.data };
      await this.cacheManager.set(cacheKey, result, 60 * 10); // cache 10 mins
      return result;

    } catch (error) {

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        'Error al consultar los datos en linea',
        error?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}