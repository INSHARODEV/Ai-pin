import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
 import { Role } from "src/shared/ROLES";
import { QueryString } from "src/common/types/queryString.type";
 
import { PaginationPipe } from "src/common/pipes/pagination.pipe";
import { AuthGuard } from "src/common/guards/auth/auth.gurd";
import { RoleMixin } from "src/common/Mixins/role.mixin";
import { UserService } from "./Uses-ervice";
import { Request } from "express";

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard, RoleMixin([Role.MANAGER, Role.ADMIN]))
  async getAdmins(@Query(PaginationPipe) query: QueryString,@Req() req:Request) {
    let { fields, limit, page, queryStr, skip, sort } = query;
    //queryStr={...queryStr,role:Role.ADMIN}
    //queryStr={...queryStr,role:{$in:[Role.SUPERVISOR,Role.SELLER]},branchId:{$in:['branchId']}}
    return await this.userService.getAllUsers({ fields, limit, page, queryStr, skip, sort } ,{
       firstName:req['user'].firstName,lastName:req['user'].lastName,role:req['user']. role
    });
  }
}
