import { Injectable } from "@nestjs/common";
import { BaseRepository } from "src/common/repositories/base.abstract.reposatory";
import { Transcript, TranscriptDocument } from "./schemas/transcitionSchema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class TranscriptionRepo extends BaseRepository<TranscriptDocument>{
    constructor(@InjectModel(Transcript.name) private readonly CompanyModle:Model<TranscriptDocument>){
        super(CompanyModle)
         }
}