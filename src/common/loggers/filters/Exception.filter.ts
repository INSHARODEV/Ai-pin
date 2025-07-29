import {
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
  } from '@nestjs/common';
  import { BaseExceptionFilter } from '@nestjs/core';
  import { Request, Response } from 'express';
  import { MongooseError } from 'mongoose';
import { logToFile } from '../helpers/logEntry';
  
  type ResponseObject = {
    statusCode: number;
    timeStamp: string;
    path: string;
    reponse: string | object;
  };
  
  export class AllExceptionsFilter extends BaseExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);
   async catch(exception: any, host: ArgumentsHost):Promise< void> {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      const myResponse: ResponseObject = {
        statusCode: 500,
        timeStamp: new Date().toISOString(),
        path: request.url,
        reponse: '',
      };
      if (exception instanceof HttpException) {
        myResponse.statusCode = exception.getStatus();
        myResponse.reponse = exception.getResponse();
      } else if (exception instanceof MongooseError) {
        myResponse.statusCode = 422;
        myResponse.reponse = exception.message.replaceAll(/\n/g, '');
      } else if (exception instanceof MongooseError) {
        myResponse.statusCode = 422;
        myResponse.reponse = exception.message.replaceAll(/\n/g, '');
      } else {
        myResponse.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        myResponse.reponse = 'INTERNAL SERVER ERROR'.toLowerCase();
      }
     
    
      response.status(myResponse.statusCode).json(myResponse);
  
      this.logger.error(JSON.stringify(myResponse),AllExceptionsFilter.name)
      await logToFile({
        level: 'error',
        ...myResponse
    });
      super.catch(exception, host);
    }
  }