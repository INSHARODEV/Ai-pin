import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { MongoDbId } from "src/common/DTOS/mongodb-Id.dto";
export type BranchDocument = HydratedDocument<Branch>;
@Schema()
export class Branch {

    @Prop({required:true})
    name:string

    @Prop()
    slug:string
   
}
export const BranshSchema = SchemaFactory.createForClass(Branch)
 
