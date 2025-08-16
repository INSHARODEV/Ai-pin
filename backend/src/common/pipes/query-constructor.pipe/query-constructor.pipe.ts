import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
  

 export interface IQuery<T> {
  constructQuery(queryObj: T ): Record<string, unknown>;
}
export interface IMutateQuery<T> {
  mutate(queryObj: T, _id?: string): Record<string, unknown>;
}


 


 export interface QueryConstructorType<T> {
  strategy: IQuery<T>|IMutateQuery<T>;
  queryObj?: T;
}

 @Injectable()
export class QueryConstructorPipe<T> implements PipeTransform {
  transform(value: QueryConstructorType<T>): Record<string, any> {
    if (!value.strategy || !value.queryObj) {
      throw new Error('Invalid query strategy or query object provided');
    }

    if ('constructQuery' in value.strategy) {
      return value.strategy.constructQuery(value.queryObj);
    }
    if ('mutate' in value.strategy) {
      console.log('value.queryObj', value.queryObj);
      return value.strategy.mutate(value.queryObj, value.queryObj['_id']);
    }

     throw new Error('Invalid strategy: constructQuery method not found');
  }
}
