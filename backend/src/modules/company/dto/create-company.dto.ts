import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class CreateCompanyDto {

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    name:string;

    
    
}
