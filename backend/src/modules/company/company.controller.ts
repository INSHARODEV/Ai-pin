import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
  Query,
  Req,
  Put,
  UseInterceptors,
} from '@nestjs/common';
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
import { map } from 'rxjs/operators';
import { Branch } from '../branch/schemas/branch.schema';
import { shiftService } from '../transcription/shift.service';
import { SalseDataInteceptor } from '../transcription/interceptors/data.interceptor';

@UseGuards(AuthGuard)
@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly EmpoyeeRepo: EmpoyeeRepo,
    private readonly shiftService:shiftService
  ) {}

  @Post()
  //@UseGuards(RoleMixin([Role.ADMIN]))
  create(@Body() createCompanyDto: CreateCompanyDto, @Req() req: Request) {
    console.log(createCompanyDto);
    return this.companyService.create(createCompanyDto, {
      role: Role.MANAGER,
      firstName: req['user'].firstName,
    });
  }

  @Get()
  @UseGuards(RoleMixin([Role.ADMIN]))
  async findAll(
    @Query(PaginationPipe)
    { fields, limit, queryStr, skip, sort, page }: QueryString,
    @Req() req: Request,
  ) {
    const companies = await this.companyService.findAll(
      { fields, limit, queryStr, skip, sort, page },
      { role: Role.MANAGER, firstName: req['user'].firstName },
    );
    console.log(companies);
    const data = await Promise.all(
      (companies.data as Company[]).map(async (company) => {
        const branches = company.branchs ?? [];
        console.log('hereherehere', (company as any).createdAt);
        // Get employee counts per branch
        const branchWithEmpCounts = await Promise.all(
          branches.map(async (branch) => {
            const empCount = await this.EmpoyeeRepo.count({ branchId: branch,role: Role.SELLER });

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
          id: (company as any)._id,
          companyName: company.name,
          managerName: company.manager.firstName,
          dateJoined: (company as any).createdAt
            ? new Date((company as any).createdAt).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          branches: branches.length,
        
          sales: totalEmployees,
        };
      }),
    );

    return {
      data,
      numberOfPages: companies.numberOfPages,
      page: companies.page,
    } as PaginatedData;
  }

  @Get(':id')
  //@UseInterceptors(BranchInterceptor)
  @UseGuards(RoleMixin([Role.ADMIN]) /*PermissonsGuard*/)
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.companyService.findOne(id, {
      role: Role.MANAGER,
      firstName: req['user'].firstName,
    });
  }
  @Get('company/:id')
  //@UseInterceptors(BranchInterceptor)
  @UseGuards(RoleMixin([Role.ADMIN]) /*PermissonsGuard*/)
  async getOne(@Param('id') id: string, @Req() req: Request) {
    const company = (await this.companyService.findOne(id, {
      role: Role.MANAGER,
      firstName: req['user'].firstName,
    })) as any;
  
    let { branchs } = company;
  
    // count employees per branch
    let totalNumber = await Promise.all(
      branchs.map((b) => this.EmpoyeeRepo.count({ branchId: b,role: Role.SELLER  }))
    );
    console.log('branchWithEmpCounts',totalNumber)

    const totalEmployees = totalNumber.reduce((sum, b) => sum + b, 0);
  
    // fetch supervisors linked to company branches
    const supervisors = (await this.EmpoyeeRepo.find({
      queryStr: { branchId: { $in: branchs }, role: Role.SUPERVISOR },
      fields: 'firstName email branchId',
      limit: 1555,
      page: 1,
      skip: 0,
      sort: 'asc',
      popultae: '',
    })) as any;
  
    const supers = supervisors.data;
  
    return {
      id: company._id,
      companyName: company.name,
      branches: branchs.map((b) => {
        const supervisor = supers.find(
          (s) => s.branchId?.toString() === b._id.toString()
        );
  
        return {
          id: b._id,
          name: b.name,
          supervisor: supervisor?.firstName || null,
          supervisorId: supervisor?._id || null,
          email: supervisor?.email || null,
        };
      }),
      managerName: company.manager.firstName,
      mangerid: company.manager._id,
      managerEmail: company.manager.email,
      dateJoined: company.createdAt,
      sales: totalEmployees,
    };
  }
  
  @Put(':id')
  @UseGuards(RoleMixin([Role.ADMIN]))
  async update(
    @Param('id', ParseMongoIdPipe) id: MongoDbId,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Req() req: Request,
  ) {
    console.log('updateCompanyDto', updateCompanyDto);
    return await this.companyService.addBranch(id, updateCompanyDto, {
      role: Role.MANAGER,
      firstName: req['user'].firstName,
    });
  }
  @Get(':mangerId/comapny')
  findOneByMangerId(@Param('mangerId') id: string, @Req() req: Request) {
    return this.companyService.findByMangerId(id, 
    );
  }
  @Patch(':id')
  async updatecomanyData(
    @Param('id', ParseMongoIdPipe) id: MongoDbId,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Req() req: Request,
  ) {
    console.log('updateCompanyDto', updateCompanyDto);
    return await this.companyService.update(id, updateCompanyDto, {
      role: Role.MANAGER,
      firstName: req['user'].firstName,
    });
  }

  @Delete(':id')
  @UseGuards(RoleMixin([Role.MANAGER, Role.ADMIN]))
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
  @Get('branchs/shifts')
  @UseInterceptors(SalseDataInteceptor)
  async getshiftsReatedlTOACoampny( 
@Req( ) req:Request,
@Query(PaginationPipe)
qstr: QueryString,

){
  const company=await this.companyService.findByMangerId(req['user']._id) as Company
 
  
    let { branchs } = company;
   const d=     await this.shiftService.getAll({...qstr,queryStr: { branchId: { $in: branchs } }})
   console.log(d)
   return d
  }
}
