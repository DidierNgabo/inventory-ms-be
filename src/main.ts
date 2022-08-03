import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/helper/GlobalExceptionFilter';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);

  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');
  //const port: number = Number(process.env.PORT) || 4000;

  app.enableCors();
  app.setGlobalPrefix('api', {
    exclude: [
      { path: '/auth/register', method: RequestMethod.POST },
      { path: '/auth/login', method: RequestMethod.POST },
      { path: '/auth/refresh', method: RequestMethod.POST },
      { path: '/auth/reset/:id', method: RequestMethod.POST },
    ],
  });
  //app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // swagger configuration

  const Swaggerconfig = new DocumentBuilder()
    .setTitle('Anik hms')
    .setDescription('Anik hms Api documentation')
    .setVersion('1')
    .addTag('anik')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, Swaggerconfig);
  SwaggerModule.setup('api-doc', app, document);

  await app.listen(port, () => {
    console.log(process.env.PORT);
    console.log('[WEB]', `http://localhost:${port}`);
  });
}
bootstrap();
