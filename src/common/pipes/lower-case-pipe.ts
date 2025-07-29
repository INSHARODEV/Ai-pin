import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class LowerCasePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
 
    if (typeof value !== 'object' || value === null) return value; 
   
    const transformedObject: Record<string, any> = {};

    for (const [key, val] of Object.entries(value)) {
     if(key!=='type'&& key!=='password')
      { 
        transformedObject[key] = typeof val === 'string' ? val.toLowerCase().trim() : val}
        else{
          transformedObject[key]=val
        };

      }
       return transformedObject;
    }
}