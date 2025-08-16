import { Controller, Get, Inject, Logger, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Request } from 'express';
import { LoggerService } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
   ) {}

  @Get()
  getHello(@Req() req: Request): string {
 
    return this.appService.getHello();
  }
}
