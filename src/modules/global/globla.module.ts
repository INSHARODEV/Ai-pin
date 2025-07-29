import { DynamicModule,  Logger,  Module } from '@nestjs/common';
 
 
import { ConfigModule } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';
 
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
 

 
import { LoggingInterceptor } from 'src/common/loggers/interceptors/logging.interceptor';
import { UtilsModule } from '../utils/utils.module';
 
@Module({})
export class GlobalModlue {
  static forRoot(): DynamicModule {
    return {
      module: GlobalModlue,
      imports: [
    ConfigModule.forRoot(),

        // CacheModule.register({
        //   isGlobal: true,
        //   ttl: 60 * 1000,
        // }),
     
     
        // ThrottlerModule.forRoot([
        //   {
        //     ttl: 60000,
        //     limit: 100,
        //   },
        // ]),
        UtilsModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGO_URL as string, {
          maxPoolSize: 100,
        }),
      ],
      providers: [
        Logger,
        // {
        //   provide: APP_INTERCEPTOR,
        //   useClass: CacheInterceptor,
        // }
       
        {
          provide: APP_INTERCEPTOR,
          useClass: LoggingInterceptor,
        },LoggingInterceptor
        // {
        //   provide: APP_FILTER,
        //   useClass: AllExceptionFilter,
        // },
      //  { provide: APP_GUARD, useClass: ThrottlerGuard },
  ,  
      ],
      exports: [LoggingInterceptor,Logger],
      global: true,
    };
  }
}