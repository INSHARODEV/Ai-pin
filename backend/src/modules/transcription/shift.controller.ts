import { BadRequestException, Controller, Get, Param, Query, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { shiftService } from "./shift.service";
import { AuthGuard } from "src/common/guards/auth/auth.gurd";
import { PaginationPipe } from "src/common/pipes/pagination.pipe";
import { QueryString } from "src/common/types/queryString.type";
import { Request } from "express";
import { SalseDataInteceptor } from "./interceptors/data.interceptor";
import { isValidObjectId } from "mongoose";
import { Shift } from "./schemas/transcitionSchema";
import { PaginatedData } from "src/common/types/paginateData.type";
import { Role } from "src/shared/ROLES";
 
@Controller('shift')
@UseGuards(AuthGuard)
export class ShiftController{
    constructor( private readonly shiftService: shiftService ){}
 
    @Get()
    @UseInterceptors(SalseDataInteceptor)
    async getSHiftsData(
      @Query(PaginationPipe) { fields, limit, queryStr, skip, sort, page, popultae }: QueryString,
      @Req() req: Request
    ) {
 
      const qs =
      req['user'].role === Role.SELLER
        ? { emp: req['user']._id }
        : { branchId: req['user'].branchId };
      const data = await this.shiftService.getAll({
        fields,
        limit,
        queryStr:qs,
        skip,
        sort,
        page,
        popultae: { path: 'emp', select: 'firstName lastName' },
      });
    
      if (!data || (data.data as Shift[]).length === 0) {
        return  {data:[],numberOfPages:0,page:0}as PaginatedData
      }
    console.log('dataaa',data)
      return data;
    }
    @Get(':id')
   async getOneShfit(@Param('id' ) id:string){
       

    return       await this.shiftService.getOne(id)
    }

}