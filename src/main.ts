import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({forbidNonWhitelisted:true,whitelist:true,transform:true}))
  app.setGlobalPrefix('/api/v1/')
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
