import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { branchrepo } from './branch.repo';
import { Branch, BranchSchema,     } from './schemas/branch.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyService } from '../company/company.service';
import { CompnayRepo } from '../company/cmopany.repo';
import { CompanyModule } from '../company/company.module';
import { Company, CompanySchema, MangerSchema } from '../company/schemas/Cmopany.schema';
import {  EmpoyeeRepo, UsersRepo } from '../auth/auth.repo';
import { UsersModule } from '../users/users.module';
import { UserSchema, User, Empoylee, EmpoyleeSchema } from '../users/schmas/users.schema';
import { shiftRepo } from '../transcription/shift.repo';
import { ShfitSchema, Shift } from '../transcription/schemas/transcitionSchema';
 
@Module({
  imports:[ UsersModule,   

    MongooseModule.forFeatureAsync([
    
    
     
      {
        name: Company.name,
        useFactory: () => CompanySchema,
      },
      {
        name: Branch.name,
        useFactory: () => BranchSchema,
      },
      {
        name: Shift.name,
        useFactory: () => ShfitSchema,
      },
    ]),
    
  ],  
  controllers: [BranchController],
  providers: [BranchService,branchrepo,CompanyService,CompnayRepo,EmpoyeeRepo,shiftRepo],

})
export class BranchModule  {
 
}
