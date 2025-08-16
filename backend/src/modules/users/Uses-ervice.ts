import { QueryString } from "src/common/types/queryString.type";
import { UsersRepo } from "../auth/auth.repo";
import { Injectable, Logger } from "@nestjs/common";
import { createUserDto } from "./dto/create-user-dto";
@Injectable()
export class UserService{
    constructor(private readonly userRepor:UsersRepo,
        private readonly logger:Logger
    ){}

    async getAllUsers({fields,limit,page,skip,sort,queryStr}:QueryString,{firstName,lastName, role}:Partial<createUserDto>){
        this.logger.verbose(  ` user : ${firstName as string+lastName as string} with role :${role} is retriving All Admins Data`)
      return   await this.userRepor.find({fields,limit,page,queryStr,skip,sort})
    }
}