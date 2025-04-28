import { Module } from '@nestjs/common';
import { ConsultaRucController } from './controllers/consulta-ruc.controller';
import { HttpModule } from '@nestjs/axios';
import { SriRUCService } from './services/consulta-ruc.service';

@Module({
  controllers: [ConsultaRucController],
  providers: [SriRUCService],
  exports: [SriRUCService],
  imports: [HttpModule,
    HttpModule,
  ]
})
export class ConsultaRucModule { }