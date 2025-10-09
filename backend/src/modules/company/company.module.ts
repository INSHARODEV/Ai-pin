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
import { shiftService } from '../transcription/shift.service';
import { shiftRepo } from '../transcription/shift.repo';
import { ShfitSchema, Shift, Transcript, TranscriptSchema,   } from '../transcription/schemas/transcitionSchema';
 // assuming you have this

@Module({
  imports: [
    BranchModule,
 
      MongooseModule.forFeature([
        { name: Transcript.name, schema: TranscriptSchema  },
        { name: Shift.name, schema: ShfitSchema },
      ]),
 
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
  providers: [CompanyService, CompnayRepo,EmpoyeeRepo,shiftService,shiftRepo],
  exports: [CompanyService, CompnayRepo,shiftRepo],
})
export class CompanyModule {}
