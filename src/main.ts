import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DateFormatInterceptor } from './common/interceptor/date-format.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    credentials: true,
  });

  // app.enableCors({
  //   // origin: ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:8000'],
  //   origin: 'https://fakpi.posdek.com', // Cambiar a un origen específico en producción
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS',
  //   credentials: true,
  // });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new DateFormatInterceptor);
  app.setGlobalPrefix('api/v1');

  app.use(bodyParser.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf.toString(); // Guardamos el body crudo
    },
  }));

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
