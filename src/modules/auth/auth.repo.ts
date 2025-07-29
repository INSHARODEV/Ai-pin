import { BaseRepository } from "src/common/repositories/base.abstract.reposatory";
import { User, UserDocument } from "../users/schmas/users.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UsersModule } from "../users/users.module";
import { Logger } from "@nestjs/common";

export class authRepo extends BaseRepository<UserDocument>{
    constructor(@InjectModel(User.name)  readonly userModel: Model<UserDocument>,
 ) {
    
        super( userModel  );
}}