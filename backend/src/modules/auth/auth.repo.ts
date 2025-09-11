import { BaseRepository } from "src/common/repositories/base.abstract.reposatory";
import { Empoylee, EmpoyleeDocument, EmpoyleeSchema, User, UserDocument } from "../users/schmas/users.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
 

export class UsersRepo extends BaseRepository<UserDocument>{
    constructor(@InjectModel(User.name)  readonly userModel: Model<any>,
 ) {
    
        super( userModel  );
}}
export class EmpoyeeRepo extends BaseRepository<EmpoyleeDocument> {
    private readonly employeeModel: Model<EmpoyleeDocument>;
  
    constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
  
      const empModel =
        userModel.discriminators?.Employee ??
        userModel.discriminator<EmpoyleeDocument>("Employee", EmpoyleeSchema);
  
      super(empModel);
      this.employeeModel = empModel;
    }
  }