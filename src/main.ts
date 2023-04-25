import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaFilter } from './prisma/prisma.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // swagger
  const config = new DocumentBuilder()
    .setTitle('VivaRecruit Backend')
    .setVersion('1.0')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // class-validator
  app.useGlobalPipes(new ValidationPipe());

  // prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // PrismaException
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaFilter(httpAdapter));

  await app.listen(3000);
}
bootstrap();
