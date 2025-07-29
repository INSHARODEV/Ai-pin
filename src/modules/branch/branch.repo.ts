import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "src/common/repositories/base.abstract.reposatory";
import { Branch, BranchDocument } from "./schemas/branch.schema";
import { Model } from "mongoose";

export class branchrepo extends BaseRepository<BranchDocument> {
    constructor(@InjectModel(Branch.name) private readonly branchModel:Model<BranchDocument> ){
        super(branchModel) 
    }
}
 