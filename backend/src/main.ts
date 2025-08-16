
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';
import { createLogger } from 'winston';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import helmet from 'helmet';import { User } from './modules/users/schmas/users.schema';
declare namespace Express {  
  interface Request {
    user?: User;   
  }
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(compression());
  app.use(helmet());


  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 8000);
 
}
bootstrap();
