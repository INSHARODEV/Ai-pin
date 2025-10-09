import { IsArray, IsDefined, IsOptional, IsString } from 'class-validator';
import { MongoDbId } from "src/common/DTOS/mongodb-Id.dto";

export class CreateShiftDton{

    emp:MongoDbId
    @IsOptional()
    startTime:any
    transciptionsId?:MongoDbId 
    status:any
    @IsDefined()
    @IsString()
    branchId:MongoDbId 
}