import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmpoyleeSchema, User, UserSchema, } from './schmas/users.schema';

@Module({
    imports: [
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

  
})
export class UsersModule {}
