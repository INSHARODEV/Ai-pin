import { IsDefined, IsNotEmpty, IsString } from "class-validator";
import { createUserDto } from "src/modules/users/dto/create-user-dto";
import { Empoylee } from "src/modules/users/schmas/users.schema";
 
export class CreateBranchDto extends createUserDto {

    @IsString()
    @IsDefined()
    @IsNotEmpty()
    name:string
 
     Superviosr:Empoylee


}
