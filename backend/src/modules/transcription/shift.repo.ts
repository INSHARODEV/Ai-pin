import { Injectable } from "@nestjs/common";
import { BaseRepository } from "src/common/repositories/base.abstract.reposatory";
import { Shift, ShiftDocument } from "./schemas/transcitionSchema";
import { InjectModel } from "@nestjs/mongoose";
 import { Model } from "mongoose";

@Injectable()
export class shiftRepo extends BaseRepository<ShiftDocument> {
constructor(@InjectModel(Shift.name)private readonly shiftModel:Model<ShiftDocument> ){
    super(shiftModel)
}
}

 