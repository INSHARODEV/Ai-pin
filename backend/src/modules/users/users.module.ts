import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmpoyleeSchema, User, UserSchema, } from './schmas/users.schema';
import {  UsersController } from './users.controller';
import { UsersRepo } from '../auth/auth.repo';
import { UserService } from './Uses-ervice';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule,
        MongooseModule.forFeatureAsync([
          {
            name: User.name,
            useFactory: () => {
              const schema = UserSchema;
              schema.discriminator('Employee',  EmpoyleeSchema);
               return schema;
            },
          },
        ]),
      ],

  controllers:[UsersController],
  providers:[  UserService,UsersRepo],  exports: [UsersRepo, UserService], // 👈 نصدّرهم
})
export class UsersModule {}
