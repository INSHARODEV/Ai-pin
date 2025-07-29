import { MongoDbId } from "../DTOS/mongodb-Id.dto";
import { PaginatedData } from "../types/paginateData.type";

export interface BaseRepositoryInterface<T> {
    create(data: Partial<T>,filter: Record<string, any>): Promise<T|Error>;
    createMany(data: Partial<T>[],uniqueField: keyof T): Promise<unknown[]>;
  
    findOneById(id: string): Promise<unknown | null>;
    findOne(options: Record<string, any>,fileds?:string): Promise<unknown | null>;
    find(options?: Record<string, any>):  Promise<PaginatedData> ;
  
    updateOne(id: MongoDbId, updateData: Partial<T>): Promise<unknown | null>;
    findOneAndUpdate(filter: Record<string, any>,updateData: Partial<T>): Promise<unknown | null>
    updateMany(filter: Record<string, any>, updateData: Partial<T>): Promise<number>;  
  
    deleteOne(id: string): Promise<T | null>;
    deleteMany(filter: Record<string, any>): Promise<number>;  
  
    count(filter?: Record<string, any>): Promise<number>;
    exists(filter: Record<string, any>): Promise<any>;
  
    aggregate(pipeline: any[]): Promise<any[]>;
    save(data: Partial<T>): Promise<T>;
    bulkWrite(operations: any[]): Promise<any>;
  }
 