
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SriPlacasService } from './service/consulta-placas.service';
import { ConsultaVehiculoController } from './controller/consulta-placas.controller';



@Module({
  controllers: [ConsultaVehiculoController],
  providers: [SriPlacasService],
  exports: [SriPlacasService],
  imports: [HttpModule,
    HttpModule,
  ]
})
export class ConsultaVehiculosModule { }