import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
  Query,
  Put,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.gurd';
import { RoleMixin } from 'src/common/Mixins/role.mixin';
import { CompanyService } from '../company/company.service';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongodb-id.pipe';
import { MongoDbId } from 'src/common/DTOS/mongodb-Id.dto';
import { Request } from 'express';
import { PaginationPipe } from 'src/common/pipes/pagination.pipe';
import { QueryString } from 'src/common/types/queryString.type';
import { Role } from 'src/shared/ROLES';
import { map } from 'rxjs/operators';
import { Company } from '../company/schemas/Cmopany.schema';
import { PaginatedData } from 'src/common/types/paginateData.type';
import { EmpoyeeRepo } from '../auth/auth.repo';
 
@Controller('branch')
@UseGuards(AuthGuard)
export class BranchController {
  constructor(
    private readonly branchService: BranchService,
    private readonly CompanyService: CompanyService,
    private readonly empRepo:EmpoyeeRepo
  ) {}

  @Post(':companyId')
  @UseGuards(RoleMixin([Role.ADMIN]))
  async create(
    @Body() createBranchDto: CreateBranchDto,
    @Param('companyId', ParseMongoIdPipe) companyId: MongoDbId,
    @Req() req: Request,
  ) {
    const exsisitngCompany = await this.CompanyService.findOne(
      companyId as any,
      {
        email: req['user']['email'],
        firstName: req['user']['firstName'],
      },
    );

    console.log(req['user']['email']);
    if (!exsisitngCompany)
      throw new BadRequestException('this comapny dose not exsisit');
    const newBranch = await this.branchService.create(createBranchDto, {
      email: req['user']['email'],
      firstName: req['user']['firstName'],
    });
    await this.CompanyService.update(
      companyId,
      {
        $addToSet: { branchs: newBranch._id },
      },
      { role: Role.MANAGER, firstName: req['user'].firstName },
    );
    return newBranch;
  }
  @Get(':companyId')
  @UseGuards(RoleMixin([Role.ADMIN]))
  async findAll(
    @Param('companyId', new ParseMongoIdPipe()) companyId: string,
    @Req() req: Request,
    @Query(PaginationPipe)
    { fields, limit, queryStr, skip, sort, page, popultae }: QueryString,
  ) {
    const existingCompany = (await this.CompanyService.findOne(companyId, {
      email: req['user']['email'],
      firstName: req['user']['firstName'],
    })) as Company;
  
    if (!existingCompany)
      throw new BadRequestException('This company does not exist');
  
    const { branchs } = existingCompany;
  
    // ✅ Fetch paginated branches
    const res = await this.branchService.findAll(
      {
        fields,
        limit,
        queryStr: { _id: { $in: branchs } },
        skip,
        sort,
        page,
        popultae,
      },
      { email: req['user']['email'] },
    );
  
    const branchRows  = await Promise.all(
      (res.data as any[]).map(async (branch) => {
        const [supervisor, sellerCount] = await Promise.all([
          this.empRepo.findOne({
            branchId: branch._id,
            role: Role.SUPERVISOR,
          }),
          this.empRepo.count({ branchId: branch._id, role: Role.SELLER }),
        ]);
  
        return {
          id: branch._id.toString(),
          name: branch.name,
          dateJoined:  new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }).format(new Date(branch.createdAt)),
          supervisor: supervisor ? (supervisor as any).firstName : null,
          sales: sellerCount,
          companyId: branch.companyId?.toString(),
        };
      }),
    );
  
    return {
      data: branchRows,
      numberOfPages: res.numberOfPages,
      page: res.page,
    }  
  }
  

  @Get(':id')
  @UseGuards(RoleMixin([Role.ADMIN]))
  async findOne(
    @Param('id', new ParseMongoIdPipe()) id: string,
    @Param('companyId', new ParseMongoIdPipe()) companyId: string,

    @Req() req: Request,
  ) {
    const exsisitngCompany =
      await this.CompanyService.findOneBybranchAndCompanyId(companyId, id);
    if (!exsisitngCompany)
      throw new BadRequestException('this comapny dose not exsisit');
    return await this.branchService.findOne(id, {
      email: req['user']['email'],
      firstName: req['user']['firstName'],
    });
  }

  @Put(':id')
  @UseGuards(RoleMixin([Role.ADMIN]))
  async update(
    @Param('id', new ParseMongoIdPipe()) id: MongoDbId,
    @Body() updateBranchDto: UpdateBranchDto,
    @Param('companyId', new ParseMongoIdPipe()) companyId: string,
    @Req() req: Request,
  ) {
    const exsisitngCompany =
      await this.CompanyService.findOneBybranchAndCompanyId(companyId, id);
    if (!exsisitngCompany)
      throw new BadRequestException('this comapny dose not exsisit');
    return this.branchService.update(id, updateBranchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.branchService.remove(+id);
  }
}
