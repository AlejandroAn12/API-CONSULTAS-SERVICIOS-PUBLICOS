import { Module } from '@nestjs/common';
import { SriCedulaService } from './services/consulta-cedula.service';
import { HttpModule } from '@nestjs/axios';
import { ConsultaCedulaController } from './controllers/consulta-cedula.controller';
import { AuthModule } from '../admin/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
// import { ApiKeyModule } from '../admin/auth/api-key/api-key.module';
// import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
// import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [ConsultaCedulaController],
  providers: [SriCedulaService, 
    // {
    //   provide: APP_GUARD,
    //   useClass: ApiKeyGuard,
    // }
  ],
  exports: [SriCedulaService],
  imports: [HttpModule,
    HttpModule,
    AuthModule,
    PrismaModule,
    // ApiKeyModule,
  ]
})
export class ConsultaCedulaModule { }