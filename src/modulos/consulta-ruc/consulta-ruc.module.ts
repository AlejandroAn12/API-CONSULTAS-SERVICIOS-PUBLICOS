import { Module } from '@nestjs/common';
import { ConsultaRucController } from './controllers/consulta-ruc.controller';
import { HttpModule } from '@nestjs/axios';
import { SriRUCService } from './services/consulta-ruc.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from '../admin/auth/auth.module';
// import { ApiKeyModule } from '../admin/auth/api-key/api-key.module';

@Module({
  controllers: [ConsultaRucController],
  providers: [SriRUCService],
  exports: [SriRUCService],
  imports: [HttpModule,
    HttpModule,
    AuthModule,
    PrismaModule,
    // ApiKeyModule
  ]
})
export class ConsultaRucModule { }