import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class FilterMatchPayersPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (Array.isArray(value)) {
      return value.map((item) => this.filterObject(item));
    }

    if (typeof value === 'object' && value !== null) {
      return this.filterObject(value);
    }

    return value;
  }

  private filterObject(obj: Record<string, any>) {
    const filtered: Record<string, any> = {};
    for (const key in obj) {
      filtered[key] = obj[key]; 
    }
    return filtered;
  }
}
