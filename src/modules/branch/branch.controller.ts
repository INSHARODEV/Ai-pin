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
import { Role } from '../users/schmas/users.schema';
import { CompanyService } from '../company/company.service';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongodb-id.pipe';
import { MongoDbId } from 'src/common/DTOS/mongodb-Id.dto';
import { Request } from 'express';
import { PaginationPipe } from 'src/common/pipes/pagination.pipe';
import { QueryString } from 'src/common/types/queryString.type';

@Controller('branch')
@UseGuards(AuthGuard)
export class BranchController {
  constructor(
    private readonly branchService: BranchService,
    private readonly CompanyService: CompanyService,
  ) {}

  @Post()
  @UseGuards(RoleMixin([Role.ADMIN]))
  
  async create(
    @Body() createBranchDto: CreateBranchDto,
    @Param('companyId', new ParseMongoIdPipe()) companyId: string,
    @Req() req: Request,
  ) {
    const exsisitngCompany = await this.CompanyService.findOne(companyId, {
      email: req['user']['email'],
      firstName: req['user']['firstName'],
    });
    if (!exsisitngCompany)
      throw new BadRequestException('this comapny dose not exsisit');
    return await this.branchService.create(createBranchDto, {
      email: req['user']['email'],
      firstName: req['user']['firstName'],
    });
  }

  @Get()
  @UseGuards(RoleMixin([Role.ADMIN]))
  async findAll(
    @Param('companyId', new ParseMongoIdPipe()) companyId: string,
    @Req() req: Request,
    @Query(new PaginationPipe())
    { fields, limit, queryStr, skip, sort, page }: QueryString,
  ) {
    const exsisitngCompany = await this.CompanyService.findOne(companyId, {
      email: req['user']['email'],
      firstName: req['user']['firstName'],
    });
    if (!exsisitngCompany)
      throw new BadRequestException('this comapny dose not exsisit');
    return await this.branchService.findAll(
      { fields, limit, page, queryStr, skip, sort },
      {
        email: req['user']['email'],
        firstName: req['user']['firstName'],
      },
    );
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
  async update(@Param('id',new ParseMongoIdPipe() ) id: MongoDbId, @Body() updateBranchDto: UpdateBranchDto, 
  @Param('companyId', new ParseMongoIdPipe()) companyId: string,
  @Req() req: Request,) {
    const exsisitngCompany =
    await this.CompanyService.findOneBybranchAndCompanyId(companyId, id);
  if (!exsisitngCompany)
    throw new BadRequestException('this comapny dose not exsisit');
    return this.branchService.update(id, updateBranchDto,);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.branchService.remove(+id);
  }
}
