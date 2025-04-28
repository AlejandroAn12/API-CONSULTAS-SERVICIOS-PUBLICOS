import { Module } from '@nestjs/common';
import { SriCedulaService } from './services/consulta-cedula.service';
import { HttpModule } from '@nestjs/axios';
import { ConsultaCedulaController } from './controllers/consulta-cedula.controller';

@Module({
  controllers: [ConsultaCedulaController],
  providers: [SriCedulaService],
  exports: [SriCedulaService],
  imports: [HttpModule,
    HttpModule,
  ]
})
export class ConsultaCedulaModule { }