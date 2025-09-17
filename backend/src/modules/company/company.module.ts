import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
 import { MongooseModule } from '@nestjs/mongoose';
 
import { BranchModule } from '../branch/branch.module';
import { Company, CompanySchema, Manager, MangerSchema,   } from './schemas/Cmopany.schema';
import { User, UserSchema } from '../users/schmas/users.schema';
import { CompnayRepo } from './cmopany.repo';
import { EmpoyeeRepo, UsersRepo } from '../auth/auth.repo';
import { UsersModule } from '../users/users.module';
 // assuming you have this

@Module({
  imports: [
    BranchModule,
  
    UsersModule,
    MongooseModule.forFeatureAsync([
      {
        name: Company.name,
        useFactory: () => {
          return CompanySchema;
        },
      },
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.discriminator(Manager.name, MangerSchema); 
          return schema;
        },
      },
    ]),
  ],
  controllers: [CompanyController],
  providers: [CompanyService, CompnayRepo,EmpoyeeRepo],
  exports: [CompanyService, CompnayRepo],
})
export class CompanyModule {}
