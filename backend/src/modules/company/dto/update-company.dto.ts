import { PartialType } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';
import { IsArray, IsMongoId, IsString } from 'class-validator';
import { Manager } from '../schemas/Cmopany.schema';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
    @IsString()
    @IsArray({})
    @IsMongoId()
    manager:Manager

    @IsString()
    @IsArray({})
    @IsMongoId()
    branchs:string[]
}
