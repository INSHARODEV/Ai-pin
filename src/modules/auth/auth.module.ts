import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { authRepo } from './auth.repo';
import { UsersModule } from '../users/users.module';
import { EmpoyleeSchema, User, UserSchema } from '../users/schmas/users.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[UsersModule,  
 
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
  providers: [AuthService,authRepo],
})
export class AuthModule {}
