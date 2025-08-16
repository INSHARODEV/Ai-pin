import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger, Query, Req, Put } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
 import { RoleMixin } from 'src/common/Mixins/role.mixin';
import { AuthGuard } from 'src/common/guards/auth/auth.gurd';
 import { QueryString } from 'src/common/types/queryString.type';
import { Request } from 'express';
import { MongoDbId } from 'src/common/DTOS/mongodb-Id.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongodb-id.pipe';
import { Role } from 'src/shared/ROLES';
  @UseGuards(AuthGuard)
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService ,
    
    
  ) {}

  @Post()
  @UseGuards(RoleMixin([Role.MANAGER]))
  create(@Body() createCompanyDto: CreateCompanyDto,@Req() req :Request) {
    return this.companyService.create(createCompanyDto,  { 
      role:Role.MANAGER,firstName: req['user'].firstName});
  }

  @Get()
  @UseGuards(RoleMixin([Role.MANAGER]))
  findAll(@Query() {fields,limit,queryStr,skip,sort,page}:QueryString,@Req() req :Request) {
   
    return this.companyService.findAll({fields,limit,queryStr,skip,sort,page},{ 
      role:Role.MANAGER,firstName: req['user'].firstName});
  }

  @Get(':id')
  @UseGuards(RoleMixin([Role.ADMIN ,Role.MANAGER] ))
  findOne(@Param('id') id: string,@Req() req :Request) {
    return this.companyService.findOne(id,{ 
      role:Role.MANAGER,firstName: req['user'].firstName});
  }

  @Put(':id')
  @UseGuards(RoleMixin([ Role.MANAGER,Role.ADMIN] ))
  async update(@Param('id',new ParseMongoIdPipe()) id: MongoDbId, @Body() updateCompanyDto: UpdateCompanyDto,@Req() req :Request) {
    return await  this.companyService.update(id, updateCompanyDto,{ 
      role:Role.MANAGER,firstName: req['user'].firstName});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
