import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/helper/GlobalExceptionFilter';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  const port: number = Number(process.env.PORT) || 4000;

  app.enableCors();
  app.setGlobalPrefix('api', {
    exclude: [
      { path: '/auth/register', method: RequestMethod.POST },
      { path: '/auth/login', method: RequestMethod.POST },
      { path: '/auth/refresh', method: RequestMethod.POST },
    ],
  });
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(port, () => {
    console.log(process.env.PORT);
    console.log('[WEB]', `http://localhost:${port}`);
  });
}
bootstrap();
