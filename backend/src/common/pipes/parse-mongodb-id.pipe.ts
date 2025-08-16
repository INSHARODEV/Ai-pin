import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { MongoDbId } from '../DTOS/mongodb-Id.dto';
 
@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  async transform(value: any) {
    
    
    
    const errors = await validate(plainToClass(MongoDbId, { id: value }));
    if (errors.length > 0) {
      throw new BadRequestException('Invalid MongoDB ObjectId');
    }
    
     return value;
  }
}
