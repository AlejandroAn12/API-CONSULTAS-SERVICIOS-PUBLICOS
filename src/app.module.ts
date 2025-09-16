import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConsultaRucModule } from './modulos/consulta-ruc/consulta-ruc.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConsultaCedulaModule } from './modulos/consulta-cedula/consulta-cedula.module';
import { ConsultaVehiculosModule } from './modulos/consulta-vehiculos/consulta-vehiculos.module';
import { AdminModule } from './modulos/admin/admin.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { BalanceMiddleware } from './common/middlewares/balance.middleware';
import { PaypalModule } from './modulos/paypal/paypal.module';
import { PaypalWebhookModule } from './modulos/paypal/Webhook/paypal-webhook.module';
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
    PaypalModule,
    PaypalWebhookModule

  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BalanceMiddleware).forRoutes('*'); // aplica a todas las rutas
  }
}
