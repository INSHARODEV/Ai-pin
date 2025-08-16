import { BaseRepository } from "src/common/repositories/base.abstract.reposatory";
import { User, UserDocument } from "../users/schmas/users.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
 

export class UsersRepo extends BaseRepository<UserDocument>{
    constructor(@InjectModel(User.name)  readonly userModel: Model<UserDocument>,
 ) {
    
        super( userModel  );
}}