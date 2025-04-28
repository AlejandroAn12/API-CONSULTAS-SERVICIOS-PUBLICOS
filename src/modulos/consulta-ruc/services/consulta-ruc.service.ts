import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
import { RUCDTO } from '../dto/ruc.dto';

@Injectable()
export class SriRUCService {
  private readonly baseUrl =
    'https://srienlinea.sri.gob.ec/sri-catastro-sujeto-servicio-internet/rest/ConsolidadoContribuyente/obtenerPorNumerosRuc';

  private readonly baseUrl2 =
    'https://srienlinea.sri.gob.ec/sri-catastro-sujeto-servicio-internet/rest/ConsolidadoContribuyente/existePorNumeroRuc';

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) { }

  async obtenerDatosPorRuc(rucDTO: RUCDTO): Promise<{ existe: boolean; data: any }> {

    const { ruc } = rucDTO;
    const cacheKey = `sri:ruc:${ruc}`;
    const cached = await this.cacheManager.get<{ existe: boolean; data: any }>(cacheKey);
    
    if (cached) {
      console.log(`📦 Cache hit para RUC: ${ruc}`);
      return cached;
    }
    
    try {
      const urlExiste = `${this.baseUrl2}?numeroRuc=${ruc}`;
      console.log('url', urlExiste)
      const existeResponse = await firstValueFrom(this.httpService.get(urlExiste));
      const existe = existeResponse.data === true;

      if (!existe) {
        const result = { existe: false, data: [] };
        await this.cacheManager.set(cacheKey, result, 60 * 10); // cache 10 mins
        return result;
      }

      const url = `${this.baseUrl}?ruc=${ruc}`;

      const response = await firstValueFrom(this.httpService.get(url));

      const result = { existe: true, data: response.data };
      await this.cacheManager.set(cacheKey, result, 60 * 10); // cache 10 mins
      return result;
    } catch (error) {
      console.error('❌ Error al consultar el SRI:', error.message);
      return { existe: false, data: null };
    }
  }
}