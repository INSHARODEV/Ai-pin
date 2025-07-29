import { IsEmail, IsOptional, IsString, IsStrongPassword, Length } from "class-validator";
import { Role } from "../schmas/users.schema";
import { Type } from "class-transformer";

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
    password:string
    @IsOptional()
    @Type()
    role:Role
}

 
 
 
