import { PipeTransform, Injectable } from '@nestjs/common';
import { QueryString } from '../types/queryString.type';
 @Injectable()
export class PaginationPipe implements PipeTransform {
  transform(value: any) {
     return this.paginate(value);
    
  }
  
  paginate(queryString: QueryString) {
    let sort: string='ASC';
    const queryObj = { ...queryString };
  

    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    if (queryString.sort) {
      sort = queryString.sort.split(',').join(' ');
    }

    const fields = '-__v';

    const page = queryString.page as number * 1 || 1;
    const limit = queryString.limit * 1 || 8;
    const skip = (page - 1) * limit;
    queryStr    = JSON.parse(queryStr) ;
    for (const key in queryStr as {}) {
      if (typeof queryStr[key] === "string"  ) {
        queryStr['key'] = { $regex: `^${queryStr[key]}`, $options: "i" };  
      }
    }
    return { limit, skip, queryStr, fields, sort, page,popultae:'' };
  }
}