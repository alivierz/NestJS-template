import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina campos que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si envían campos extra
      transform: true, // Convierte los tipos automáticamente
      exceptionFactory: (errors) => {
        // Mapeamos los errores para obtener solo el primer mensaje de cada campo
        const values = errors.map((error: any) => {
          return {
            field: error.property,
            error: Object.values(error.constraints)[0],
          };
        });

        // Retornamos la excepción con tu estructura personalizada
        return new BadRequestException({
          message: 'error de parametros', // Mensaje fijo solicitado
          values: values, // Arreglo con el detalle de cada campo
        });
      },
    }),
  );

  // 1. Configuración base de OpenAPI (Swagger)
  const config = new DocumentBuilder()
    .setTitle('Documentacion Personal')
    .setDescription('Documentacion')
    .setVersion('0.0.1')
    .addBearerAuth() // Para que Scalar te permita probar con JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // main.ts
  app.use(
    '/docs',
    apiReference({
      content: document,
      theme: 'purple',
      layout: 'modern',
      showSidebar: true,
      showDeveloperTools: 'never',
      authentication: {
        preferredSecurityScheme: 'bearer',
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
