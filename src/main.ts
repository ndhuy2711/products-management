import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Enable CORS
    app.enableCors();

    // Enable validation
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Loại bỏ các thuộc tính không được định nghĩa trong DTO
        transform: true, // Tự động chuyển đổi kiểu dữ liệu
        forbidNonWhitelisted: true, // Từ chối request nếu có thuộc tính không được định nghĩa
      }),
    );

    // Swagger configuration
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Product Management API')
      .setDescription('API documentation for Product Management System')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
      },
    });

    // Get port from environment variables
    const port = configService.get<number>('PORT', 3000);

    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
    console.log(
      `Swagger documentation is available at: http://localhost:${port}/api`,
    );
  } catch (error) {
    console.error('Error starting the application:', error);
    process.exit(1);
  }
}

bootstrap();
