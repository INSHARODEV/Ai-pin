
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
 import { createLogger } from 'winston';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as bodyParser from 'body-parser'
import helmet from 'helmet';import { User } from './modules/users/schmas/users.schema';
import { NestExpressApplication } from '@nestjs/platform-express';
declare namespace Express {  
  interface Request {
    user?: User;   
  }
}
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.enableCors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  app.useBodyParser('json', { limit: '1500mb' });  app.use(compression());
  app.use(helmet());

  
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 8000);
 
}
bootstrap();
