import { PartialType } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';
import { IsArray, IsMongoId, IsString } from 'class-validator';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
    @IsString()
    @IsArray({})
    @IsMongoId()
    Admins:string[]

    @IsString()
    @IsArray({})
    @IsMongoId()
    branchs:string[]
}
