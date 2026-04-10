import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('/api/v1/');
  app.enableCors({
    origin: ['*', process.env.FRONTEND_URL, 'http://localhost:5173'],
  });
  const config = new DocumentBuilder()
    .setTitle('TaskFlow API')
    .setDescription('The Task Management System API documentation')
    .setVersion('1.0')
    .addBearerAuth() // 👈 Tells Swagger we use JWT tokens
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // The URL where the

  // Add '0.0.0.0' as the second parameter
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
