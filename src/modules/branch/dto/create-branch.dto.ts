import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class CreateBranchDto {

    @IsString()
    @IsDefined()
    @IsNotEmpty()
    name:string
 


}
