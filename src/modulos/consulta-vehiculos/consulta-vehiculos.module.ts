
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PlacasService } from './service/consulta-placas.service';
import { ConsultaVehiculoController } from './controller/consulta-placas.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from '../admin/auth/auth.module';
import { MultasService } from './service/multas.service';



@Module({
  controllers: [ConsultaVehiculoController],
  providers: [PlacasService, MultasService],
  exports: [PlacasService],
  imports: [HttpModule,
    HttpModule,
    AuthModule,
    PrismaModule
  ]
})
export class ConsultaVehiculosModule { }