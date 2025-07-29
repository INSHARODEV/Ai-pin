import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company ,CompanySchema} from './schemas/Cmopany.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CompnayRepo } from './cmopany.repo';
import { BranchModule } from '../branch/branch.module';
 import { RouterModule } from '@nestjs/core';

@Module({
  imports: [ 
    BranchModule,
    MongooseModule.forFeature([{ name: Company.name, schema:  CompanySchema }]),
    RouterModule.register( [{
      path:'company/:companyId',
      module: BranchModule,
    }])
  ],
  controllers: [CompanyController],
  providers: [CompanyService,CompnayRepo],
  exports:[CompanyService,CompnayRepo]
})
export class CompanyModule {}
