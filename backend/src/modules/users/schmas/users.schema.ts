import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import mongoose, { HydratedDocument, model } from 'mongoose';
import slugify from 'slugify';
import { MongoDbId } from 'src/common/DTOS/mongodb-Id.dto';
import { Role } from 'src/shared/ROLES';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, discriminatorKey: 'jobTitle' })
export class User {
  @Prop()
  firstName: string;
  @Prop()
  @IsOptional()
  lastName?: string;
  @Prop()
  image?: string;
  @Prop({ unique: true })
  email: string;
  @Prop({ select: false, required: false })
  password?: string;
  @Prop()
  OTP: string;
  @Prop({ enum: Role, required: true })
  role: Role;
  @Prop({ required: false })
  permissons?: string[];
  @Prop()
  slug: string;
}
@Schema()
export class Empoylee extends User {
  @Prop({ type: mongoose.Schema.ObjectId, ref: 'Branch' })
  branchId: MongoDbId;
 
}
 
const EmpoyleeSchema = SchemaFactory.createForClass(Empoylee);
 
const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', function (next) {
  this.slug = slugify(
    `${crypto.randomUUID().slice(0, 5)}-${this.firstName}-${this.lastName}`,
  );

  next();
});
const userModel = model<UserDocument>('User', UserSchema as mongoose.Schema);
const EmpoyleeModel = userModel.discriminator('Employee', EmpoyleeSchema);
 
export { EmpoyleeSchema, userModel, UserSchema, EmpoyleeModel  };
