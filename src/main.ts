import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
// import { ApiKeyGuard } from './common/guards/api-key.guard.tsju';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // origin: ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:8000'],
    origin: '*', // Cambiar a un origen específico en producción
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // app.useGlobalGuards(new ApiKeyGuard(app.get(ConfigService), app.get(Reflector), app.get(PrismaService)));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('API SERVICIOS')
    .setDescription('API para consultar datos de distintas instituciones públicas.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'jwt-auth',
    )
    // .addServer('http://localhost:3002')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory(), {
    swaggerOptions: {
      docExpansion: 'none',
      defaultModelsExpandDepth: -1,
    },
  });
   const port = process.env.SERVER_PORT || 3000;
  const host = process.env.SERVER_HOST || '0.0.0.0';

  await app.listen(port, host);
  console.log(`🚀 API SERVICES is running on: http://${host}:${port}`);
}
bootstrap();
