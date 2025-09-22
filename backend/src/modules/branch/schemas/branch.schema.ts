import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
  
export type BranchDocument = HydratedDocument<Branch>;
  

@Schema({timestamps:true})
export class Branch {

    @Prop({})
    name:string

    @Prop()
    slug:string
  
   
}
export const BranchSchema = SchemaFactory.createForClass(Branch)
 
