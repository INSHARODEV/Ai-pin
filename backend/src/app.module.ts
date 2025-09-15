import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalModlue } from './modules/global/globla.module';
import { CompanyModule } from './modules/company/company.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TranscriptionModule } from './modules/transcription/transcription.module';

@Module({
  imports: [
    GlobalModlue.forRoot(),
    CompanyModule,
    UsersModule,
    AuthModule,
    TranscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
