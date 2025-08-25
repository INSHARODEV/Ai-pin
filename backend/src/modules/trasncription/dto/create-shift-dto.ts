import { IsArray, IsOptional } from "class-validator";
import { MongoDbId } from "src/common/DTOS/mongodb-Id.dto";

export class CreateShiftDton{

    emp:MongoDbId
    @IsOptional()
    
    transciptionsId?:MongoDbId []
}