import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Obtener el puerto desde las variables de entorno
  const configService = app.get(ConfigService);
  const port: number = configService.get('PORT') || 3000;

  // Habilitar validación global con class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades extra
      transform: true, // Transforma tipos automáticamente (ej: string -> number)
    }),
  );

  // Habilitar CORS
  app.enableCors();

  // Configuración de Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Config Service API')
    .setDescription(
      'API REST para gestión centralizada de configuraciones dinámicas en arquitecturas de microservicios',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Endpoints de autenticación')
    .addTag('Environments', 'Gestión de entornos')
    .addTag('Variables', 'Gestión de variables de configuración')
    .addTag('Health', 'Health check del servicio')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Endpoint para visualizar la documentación
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
  console.log(`OpenAPI JSON: http://localhost:${port}/api/docs-json`);
}
bootstrap();
