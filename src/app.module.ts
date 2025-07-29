import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
 import { GlobalModlue } from './modules/global/globla.module';
import { CompanyModule } from './modules/company/company.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/users/schmas/users.schema';
import { BranchModule } from './modules/branch/branch.module';

@Module({
  imports: [GlobalModlue.forRoot() 
 , CompanyModule, UsersModule, AuthModule,  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
