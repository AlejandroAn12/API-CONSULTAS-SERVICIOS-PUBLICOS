import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Base de datos conectada con éxito!');
    } catch (error) {
      // console.error('Error al conectar con la base de datos:', error.message);
      // throw new Error('Error al conectar con la base de datos');
      console.error('Error al conectar con la base de datos:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      else if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al conectar con la base de datos');
    }
  }
}
