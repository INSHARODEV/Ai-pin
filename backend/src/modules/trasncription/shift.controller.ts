import { Controller, Get, Query, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { shiftService } from "./shift.service";
import { AuthGuard } from "src/common/guards/auth/auth.gurd";
import { RoleMixin } from "src/common/Mixins/role.mixin";
import { Role } from "src/shared/ROLES";
import { PaginationPipe } from "src/common/pipes/pagination.pipe";
import { QueryString } from "src/common/types/queryString.type";
import { Request } from "express";
import { SalseDataInteceptor } from "./interceptors/data.interceptor";

@Controller('shift')
@UseGuards(AuthGuard)
export class ShiftController{
    constructor( private readonly shiftService: shiftService ){}
@Get()
@UseGuards(RoleMixin([Role.SUPERVISOR]))
@UseInterceptors(SalseDataInteceptor)
async getSHiftsData(@Query(PaginationPipe){fields,limit, queryStr,skip,sort,page,popultae}:QueryString,@Req() req:Request){
   const data = await this.shiftService.getAll({fields,limit,queryStr:{branchId:req['user']['branchId']},skip,sort,page,popultae:{ path: 'emp',select: 'firstName lastName',}})
   console.log(data)
   return data
}

}