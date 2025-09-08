import { IsDefined, IsNotEmpty, IsString } from "class-validator";
import { createUserDto } from "src/modules/users/dto/create-user-dto";
import { Manager } from "../schemas/Cmopany.schema";
 
export class CreateCompanyDto  extends createUserDto{

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    name:string;
   
    manager:Manager

    
    
}
