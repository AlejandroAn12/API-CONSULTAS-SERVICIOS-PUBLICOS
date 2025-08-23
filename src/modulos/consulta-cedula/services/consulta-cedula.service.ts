import { Injectable, Inject, NotFoundException, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { CedulaDTO } from '../dto/cedula.dto';
import { CedulaNombresDTO } from '../dto/cedula-nombres.dto';

@Injectable()
export class SriCedulaService {
 
  private readonly baseUrl =
    'https://srienlinea.sri.gob.ec/movil-servicios/api/v1.0/deudas/porIdentificacion';

  private readonly baseUrl2 = 'https://tramites.ecuadorlegalonline.com/api/consulta-cedula/consultar-cedulanombre.php?nombres=ANCHUNDIA%20ESPINOZA%20JAVIER%20AGUSTIN&_=1755919709489';
  
  private readonly url =
    'https://tramites.ecuadorlegalonline.com/api/consulta-cedula/consulta-cedula.php';

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) { }

  async getDatosPorCedula(cedula: string): Promise<any> {
  try {
    const response$ = this.httpService.get(
      `${this.url}?name=${cedula}&_=${Date.now()}` // opcional: generar timestamp dinámico
    );

    const response = await lastValueFrom(response$);

    // AxiosResponse trae { data, status, ... }
    const data = response.data;

    return data; // aquí ya devuelves solo el JSON limpio

  } catch (error) {
    console.error('Error al consultar el SRI', error?.response?.data || error);
    throw new HttpException(
      'Error al consultar los datos en el SRI',
      error?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}


  // async obtenerDatosPorCedula(cedulaDTO: CedulaDTO) {

  //   const { cedula } = cedulaDTO;
  //   const cacheKey = `sri:cedula:${cedula}`;
  //   const cached = await this.cacheManager.get<{ existe: boolean; data: any }>(cacheKey);

  //   if (cached) {
  //     console.log(`📦 Cache hit para Cedula: ${cedula}`);
  //     return cached;
  //   }

  //   try {

  //     const url = `${this.baseUrl}/${cedula}/?tipoPersona=N&_=1745505914058`;

  //     const response = await firstValueFrom(this.httpService.get(url));

  //     const result = { existe: true, data: response.data };
  //     await this.cacheManager.set(cacheKey, result, 60 * 10); // cache 10 mins
  //     return result;
  //   } catch (error) {
  //     console.error('❌ Error al consultar el SRI el numero de cédula', error.message);
  //     return { existe: false, data: null };
  //   }
  // }


//https://tramites.ecuadorlegalonline.com/api/consulta-cedula/consultar-cedulanombre.php?nombres=ANCHUNDIA%20ESPINOZA%20JAVIER%20AGUSTIN&_=1755919709489
 //?nombres=ANCHUNDIA%20ESPINOZA%20JAVIER%20AGUSTIN&_=1755919709489
async obtenerDatosPorNombres(cedulaNDTO: CedulaNombresDTO) {
    const { primerNombre, segundoNombre, primerApellido, segundoApellido } = cedulaNDTO;

    const nombres_completos = [primerApellido, segundoApellido, primerNombre, segundoNombre]
      .filter(Boolean)
      .join(' ')
      .toUpperCase()
      .replace(/ /g, '%20');
    const cacheKey = `sri:nombres:${nombres_completos}`;
    const cached = await this.cacheManager.get<{ existe: boolean; data: any }>(cacheKey);

    if (cached) {
      console.log(`📦 Cache hit para Nombres: ${nombres_completos}`);
      return cached;
    }

    try {
      const timestamp = Date.now();
      const url = `${this.baseUrl2}/${nombres_completos}/?tipoPersona=N&resultados=30&_=${timestamp}`;

      const response = await firstValueFrom(this.httpService.get(url));
      const result = { existe: true, data: response.data };
      await this.cacheManager.set(cacheKey, result, 60 * 10);
      return result;
    } catch (error) {
      console.error('❌ Error al consultar el SRI el nombre de cédula', error.message);
      return { existe: false, data: null };
    }
  }

}