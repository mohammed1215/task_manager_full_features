import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({forbidNonWhitelisted:true,whitelist:true,transform:true}))
  app.setGlobalPrefix('/api/v1/')
  
  const config = new DocumentBuilder()
    .setTitle('TaskFlow API')
    .setDescription('The Task Management System API documentation')
    .setVersion('1.0')
    .addBearerAuth() // 👈 Tells Swagger we use JWT tokens
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // The URL where the

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
