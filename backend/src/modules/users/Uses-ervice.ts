import { QueryString } from "src/common/types/queryString.type";
import { EmpoyeeRepo, UsersRepo } from "../auth/auth.repo";
import { Injectable, Logger } from "@nestjs/common";
import { createUserDto } from "./dto/create-user-dto";
import { Empoylee } from "./schmas/users.schema";
type ID={
    _id:string
}
@Injectable()
export class UserService{
    constructor(private readonly userRepor:EmpoyeeRepo,
        private readonly logger:Logger
    ){}

    async getAllUsers({fields,limit,page,skip,sort,queryStr,popultae}:QueryString,{firstName,lastName, role}:Partial<createUserDto>){
        this.logger.verbose(  ` user : ${firstName as string+lastName as string} with role :${role} is retriving All Admins Data`)
        console.log("queryString",queryStr)
          const users= await this.userRepor.find({fields,limit,page,queryStr,skip,sort,popultae})
       
          return (users.data as (Empoylee &ID)[]).map(({ firstName, email, _id }) => ({
            firstName,
            email,
            _id,
          }));   
    }
}