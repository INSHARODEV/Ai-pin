import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import slugify from 'slugify';
import { Branch } from 'src/modules/branch/schemas/branch.schema';

export type CompanyDocument = HydratedDocument<Company>;

@Schema()
export class Company {
  @Prop()
  name: string;

  @Prop()
  slug: string;

  @Prop([{type: mongoose.Schema.ObjectId, ref: Branch.name}])
  branchId:string[]
}

export const CompanySchema = SchemaFactory.createForClass(Company);
CompanySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(`${crypto.randomUUID().slice(0, 5)}-${this.name}`);
  }
  next();
});
