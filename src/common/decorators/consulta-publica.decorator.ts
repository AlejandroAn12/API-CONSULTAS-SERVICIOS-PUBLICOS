import { SetMetadata } from '@nestjs/common';

export const CONSULTA_PUBLICA_KEY = 'isConsultaPublica';
export const ConsultaPublica = () => SetMetadata(CONSULTA_PUBLICA_KEY, true);