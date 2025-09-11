import { PipeTransform, Injectable } from '@nestjs/common';
import { QueryString } from '../types/queryString.type';

@Injectable()
export class PaginationPipe implements PipeTransform {
  transform(value: any) {
    return this.paginate(value);
  }

  paginate(queryString: QueryString) {
    let sort: string = 'ASC';
    const queryObj = { ...queryString };

    // Remove excluded fields
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Replace operators (gte, lte, etc.)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryStr = JSON.parse(queryStr);

    // Sort
    if (queryString.sort) {
      sort = queryString.sort.split(',').join(' ');
    }

    const fields = '-__v';
    const page = (queryString.page as number) * 1 || 1;
    const limit = (queryString.limit as number) * 1 || 14;
    const skip = (page - 1) * limit;

    // Dynamically apply regex to string fields EXCEPT ObjectId fields
    const objectIdFields = ['branchId', 'companyId', '_id','emp']; // ✅ add more if needed

    for (const key in queryStr as any) {
      if (
        typeof queryStr[key] === 'string' &&
        !objectIdFields.includes(key) // don’t regex ObjectId fields
      ) {
        queryStr[key] = { $regex: `^${queryStr[key]}`, $options: 'i' };
      }
    }

    return { limit, skip, queryStr, fields, sort, page, populate: '' };
  }
}
