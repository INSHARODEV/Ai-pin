import { IsArray, IsDefined, IsOptional, IsString } from 'class-validator';
import { MongoDbId } from "src/common/DTOS/mongodb-Id.dto";

export class CreateShiftDton{

    emp:MongoDbId
    @IsOptional()
    
    transciptionsId?:MongoDbId 
     
    @IsDefined()
    @IsString()
    branchId:MongoDbId 
}