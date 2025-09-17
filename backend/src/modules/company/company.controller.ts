import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Logger, Query, Req, Put, UseInterceptors } from '@nestjs/common';
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
import { PermissonsGuard } from 'src/common/guards/permissons/permissons.guard';
import { BranchInterceptor } from './intercepotrs/branch.Interceptor';
 import { Company } from './schemas/Cmopany.schema';
import { EmpoyeeRepo, UsersRepo } from '../auth/auth.repo';
import { PaginatedData } from 'src/common/types/paginateData.type';
import { PaginationPipe } from 'src/common/pipes/pagination.pipe';
     @UseGuards(AuthGuard)
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService ,
    private readonly EmpoyeeRepo: EmpoyeeRepo
    
    
  ) {}

  @Post()
  //@UseGuards(RoleMixin([Role.ADMIN]))
  create(@Body() createCompanyDto: CreateCompanyDto,@Req() req :Request) {
    console.log(createCompanyDto)
    return this.companyService.create(createCompanyDto,  { 
      role:Role.MANAGER,firstName: req['user'].firstName});
  }

  @Get()
  @UseGuards(RoleMixin([Role.ADMIN]))
  async findAll(
    @Query(PaginationPipe) { fields, limit, queryStr, skip, sort, page }: QueryString,
    @Req() req: Request,
  ) {
    const companies = await this.companyService.findAll(
      { fields, limit, queryStr, skip, sort, page },
      { role: Role.MANAGER, firstName: req['user'].firstName },
    );
console.log(companies)
    const data = await Promise.all(
      (companies.data as Company[]).map(async (company) => {
        const branches = company.branchs ?? [];
      console.log('hereherehere',(company as any).createdAt )
        // Get employee counts per branch
        const branchWithEmpCounts = await Promise.all(
          branches.map(async (branch) => {
            const empCount = await this.EmpoyeeRepo.count(
             { branchId: branch },
            );
  
            return {
              id: branch,
             
              employeeCount: empCount,
            };
          }),
        );
       
        const totalEmployees = branchWithEmpCounts.reduce(
          (sum, b) => sum + b.employeeCount,
          0,
        );
       
        return {
          id:(company as any)._id,
          name: company.name,
          manger:company.manager.firstName,
          dateJoined:( company as any).createdAt 
          ? new Date((company as any).createdAt).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
            branches: branches.length,
          sales:totalEmployees,
     
        };
      }),
    );
  
    return {
      data,
    numberOfPages:companies.numberOfPages,
    page:companies.page
    }    as PaginatedData
  }
  

  @Get(':id')
  @UseInterceptors(BranchInterceptor)
  @UseGuards(RoleMixin([Role.ADMIN]  ),/*PermissonsGuard*/)
  findOne(@Param('id') id: string,@Req() req :Request) {
    
    return this.companyService.findOne(id,{ 
      role:Role.MANAGER,firstName: req['user'].firstName});
  }

  @Put(':id')
  @UseGuards(RoleMixin([ Role.ADMIN] ),PermissonsGuard)
  async update(@Param('id',new ParseMongoIdPipe()) id: MongoDbId, @Body() updateCompanyDto: UpdateCompanyDto,@Req() req :Request) {
    return await  this.companyService.update(id, updateCompanyDto,{ 
      role:Role.MANAGER,firstName: req['user'].firstName});
  }

  @Delete(':id')
  @UseGuards(RoleMixin([ Role.MANAGER] ))
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
