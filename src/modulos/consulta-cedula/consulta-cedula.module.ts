import { Module } from '@nestjs/common';
import { CedulaService } from './services/consulta-cedula.service';
import { HttpModule } from '@nestjs/axios';
import { ConsultaCedulaController } from './controllers/consulta-cedula.controller';
import { AuthModule } from '../admin/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ConsultaCedulaController],
  providers: [CedulaService],
  exports: [CedulaService],
  imports: [HttpModule,
    HttpModule,
    AuthModule,
    PrismaModule
  ]
})
export class ConsultaCedulaModule { }