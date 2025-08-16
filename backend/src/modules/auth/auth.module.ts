import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersRepo } from './auth.repo';
import { UsersModule } from '../users/users.module';
import { EmpoyleeSchema, User, UserSchema } from '../users/schmas/users.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[ 
 
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
  controllers: [AuthController],
  providers: [AuthService,UsersRepo],
  exports:[UsersRepo]
 
})
export class AuthModule {}
