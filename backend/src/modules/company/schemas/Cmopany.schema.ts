import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import slugify from 'slugify';
import crypto from 'crypto';
import { Branch } from 'src/modules/branch/schemas/branch.schema';
import { User, userModel } from 'src/modules/users/schmas/users.schema';
 
export type CompanyDocument = HydratedDocument<Company>;

 
@Schema( )  
export class Manager extends User {
  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Branch.name  ,default:[]}])
  comapnyId?: mongoose.Types.ObjectId[];
}

const ManagerSchema = SchemaFactory.createForClass(Manager);
 
@Schema({timestamps:true})
export class Company {
  @Prop({ required: true })
  name: string;

  @Prop()
  slug: string;

 
 
@Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Branch.name  ,default:[]}])
branchs?: mongoose.Types.ObjectId[];
  ///#TODO ADJUST CMPANYNA CREATIONS add acompanyy id to manger
  @Prop({ type: ManagerSchema, })
  manager: Manager ;
}

export const CompanySchema = SchemaFactory.createForClass(Company);

 
 
export const MangerSchema = SchemaFactory.createForClass(Manager);

export const MangerModel = userModel.discriminator('MangerSchmea', MangerSchema);