import { Module } from '@nestjs/common';
import { ConsultaRucController } from './controllers/consulta-ruc.controller';
import { HttpModule } from '@nestjs/axios';
import { RUCService } from './services/consulta-ruc.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from '../admin/auth/auth.module';

@Module({
  controllers: [ConsultaRucController],
  providers: [RUCService],
  exports: [RUCService],
  imports: [HttpModule,
    HttpModule,
    AuthModule,
    PrismaModule,
    // ApiKeyModule
  ]
})
export class ConsultaRucModule { }