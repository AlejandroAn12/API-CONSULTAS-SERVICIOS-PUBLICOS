import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConsultaRucModule } from './modulos/consulta-ruc/consulta-ruc.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConsultaCedulaModule } from './modulos/consulta-cedula/consulta-cedula.module';
import { ConsultaVehiculosModule } from './modulos/consulta-vehiculos/consulta-vehiculos.module';
import { AdminModule } from './modulos/admin/admin.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      ignoreEnvFile: false,
      load: [],
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10,
        },
      ],
    }),

    CacheModule.register({
      ttl: 60 * 10, // 10 minutos de duración por defecto
      isGlobal: true,
    }),
    ConsultaRucModule,
    ConsultaCedulaModule,
    ConsultaVehiculosModule,
    AdminModule,
    PrismaModule,

    
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
