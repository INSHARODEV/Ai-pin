import { Injectable } from "@nestjs/common";
import { BaseRepository } from "src/common/repositories/base.abstract.reposatory";
import { Company, CompanyDocument } from "./schemas/Cmopany.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class CompnayRepo extends BaseRepository<CompanyDocument>{
 constructor(@InjectModel(Company.name) private readonly CompanyModle:Model<CompanyDocument>){
super(CompanyModle)
 }

} 