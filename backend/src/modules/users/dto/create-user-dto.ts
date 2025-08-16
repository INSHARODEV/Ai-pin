import { IsEmail, IsOptional, IsString, IsStrongPassword, Length } from "class-validator";
 import { Type } from "class-transformer";
import { Role } from "src/shared/ROLES";
 
export class createUserDto{
    @IsString()
    @Length(4,20)
    firstName:string
    @IsString() 
    @Length(4,20)
    lastName:string
    @IsString()
    @IsEmail()
    email:string
    @IsString()
    @IsStrongPassword()
    @IsOptional()
    password:string
    @IsOptional()
    @Type()
    role:Role
}

 
 
 
