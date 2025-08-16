import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { branchrepo } from './branch.repo';
import { Branch, BranshSchema } from './schemas/branch.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyService } from '../company/company.service';
import { CompnayRepo } from '../company/cmopany.repo';
import { CompanyModule } from '../company/company.module';
import { Company, CompanySchema } from '../company/schemas/Cmopany.schema';
 
@Module({
  imports:[    MongooseModule.forFeature([{ name: Company.name, schema:  CompanySchema }]) 
,  MongooseModule.forFeature([{ name: Branch.name, schema:  BranshSchema }]),],
  controllers: [BranchController],
  providers: [BranchService,branchrepo,CompanyService,CompnayRepo],

})
export class BranchModule  {
 
}
