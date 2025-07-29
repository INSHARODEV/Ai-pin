import { Type } from "class-transformer";
import { 
    IsDefined, 
    IsNotEmpty, 
    IsString, 
    MaxLength, 
    MinLength, 
    IsMongoId, 
    Matches 
  } from "class-validator"; 
   
  export class MongoDbId  { 
 
    @IsDefined() 
    @IsNotEmpty() 
    @MaxLength(24) 
    @MinLength(24) 
    @IsMongoId() 
    @Matches(/^[0-9a-fA-F]{24}$/) 
    @Type(() => MongoDbId)
    id: string; 
  }
  