import { Document, Model, FilterQuery } from 'mongoose';
import { BaseRepositoryInterface } from './base.interface.reposatireis';
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PaginatedData } from '../types/paginateData.type';
import { MongoDbId } from '../DTOS/mongodb-Id.dto';

export abstract class BaseRepository<T> implements BaseRepositoryInterface<T> {
  private readonly logger: Logger = new Logger();
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    this.logger.warn(`${JSON.stringify(data)} is bieng created `);

    const createdDocument = await this.model.create(data);
    this.logger.warn(`${JSON.stringify(createdDocument)} has been    created `);

    if (!createdDocument) {
      this.logger.error(`Failed to create document: ${JSON.stringify(data)}`);
      throw new InternalServerErrorException('Failed to create document');
    }

    this.logger.log(
      `Successfully created document: ${JSON.stringify(createdDocument)}`,
    );
    return createdDocument;
  }

  async createMany(
    data: Partial<T>[],
    uniqueField: Extract<keyof T, string>,
  ): Promise<unknown[]> {
    const identifiers = data.map((item) => item[uniqueField]);

    const existingRecords = await this.model
      .find({
        [uniqueField]: { $in: identifiers },
      } as FilterQuery<T>)
      .lean()
      .exec();

    const existingValues = new Set(
      existingRecords.map(
        (record) => (record as Record<string, unknown>)[uniqueField],
      ),
    );

    const newData = data.filter((el) => !existingValues.has(el[uniqueField]));

    if (newData.length === 0) return [];

    return await this.model.insertMany(newData);
  }

  async findOneById(id: string,populate=''): Promise<unknown | Error> {
    this.logger.verbose(
      `attemting to get user with its id ${id.slice(1, 5)}...`,
    );
    const exsistingDoc = await this.model.findById(id).populate(populate).lean().exec();
    if (exsistingDoc) return exsistingDoc;
    this.logger.error(`we ware not able to find this ${id}  `);
    throw new NotFoundException();
  }

  async findOne(
    options: FilterQuery<T>,
    fileds: string = '',
  ): Promise<unknown | null> {
    this.logger.debug(
      `geting the ${this.model.name} uisng data =>${JSON.stringify(options)}`,
    );
    const exsistingDoc = await this.model
      .findOne(options)
      .select(fileds)
      .lean()
      .exec();

    if (!exsistingDoc) throw new BadRequestException(`Failed to finde`);
    return exsistingDoc;
  }

  async find({
    limit,
    skip,
    queryStr,
    fields,
    sort,
    page,
    popultae,
  }): Promise<PaginatedData> {
    const total = await this.count(queryStr);
    const numberOfPages = Math.ceil(total / limit);
    const data = await this.model
      .find(queryStr)
      .limit(limit)
      .skip(skip)
      .populate(popultae)
      .select(fields)
      .sort(sort)
      .lean()
      .exec();
console.log('here',this.model)
    return { data, numberOfPages, page };
  }
  
  async findOneAndUpdate(
    filter: FilterQuery<T>,
    updateData: Partial<T>,
  ): Promise<unknown | null> {
    const exsistngDocument = await this.model
      .findOneAndUpdate(filter, updateData, { new: true })
      .exec();
    if (!exsistngDocument) throw new BadRequestException(`Failed to update`);

    return exsistngDocument;
  }
  async updateOne(
    id: MongoDbId,
    updateData: Partial<T>,
  ): Promise<unknown | null> {
    this.logger.debug(
      `updating  model ${this.model.name} , a document that as the id of ${id} with data: ${JSON.stringify(updateData)}`,
    );

    try {
      const updatedDocument = await this.model.findByIdAndUpdate(
        id,
        updateData,
        { new: true },
      );
      console.log(updateData);
      this.logger.warn(`new update doc${JSON.stringify(updateData)}`);
      return updatedDocument;
    } catch (errror) {
      this.logger.error(
        `faild to update document  with error status :${errror.status} and stack :${errror.stack}`,
      );
      throw new BadRequestException();
    }
  }

  async updateMany(
    filter: FilterQuery<T>,
    updateData: Partial<T>,
  ): Promise<number> {
    const result = await this.model.updateMany(filter, updateData);
    return result.modifiedCount;
  }

  async deleteOne(id: string): Promise<T | null> {
    const deletedDoc = await this.model.findByIdAndDelete(id);
    if (!deletedDoc) throw new NotFoundException(`  not found`);
    return deletedDoc;
  }

  async deleteMany(filter: FilterQuery<T>): Promise<number> {
    const result = await this.model.deleteMany(filter).exec();
    return result.deletedCount || 0;
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  async aggregate(pipeline: any[]): Promise<any[]> {
    return this.model.aggregate(pipeline).exec();
  }
  async save(data: Partial<T>): Promise<T> {
    const createdDocument = new this.model(data);
    await createdDocument.save();
    if (!createdDocument)
      throw new InternalServerErrorException(`Failed to save document`);
    return createdDocument;
  }
  async bulkWrite(operations: any[]): Promise<any> {
    return this.model.bulkWrite(operations);
  }
  async exists(filter: Record<string, any>): Promise<any> {
    return await this.model.exists(filter);
  }
}
