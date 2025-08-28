import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateShiftDton } from './dto/create-shift-dto';
import { shiftRepo } from './shift.repo';
import { MongoDbId } from "src/common/DTOS/mongodb-Id.dto";
import { QueryString } from "src/common/types/queryString.type";
 
@Injectable()
export class shiftService{
    constructor(private readonly shiftRepo:shiftRepo){}

    async createShift(CreateShiftDto:CreateShiftDton){
        return await this.shiftRepo.create(CreateShiftDto)
    }
    async updateShift(shiftid:MongoDbId,transactionId){
        try{

        
        console.log('shoft id and tasiciton id',shiftid,transactionId)
      let updatedDc=  await this.shiftRepo.findOneAndUpdate({ _id:  shiftid },
        { $push: { transcriptionsId: transactionId } } as any
        )}
        catch(e){
            throw new BadRequestException(e.message)
        }
     //   console.log(updatedDc)
    }
    async getAll({fields,limit,skip,sort,page}:QueryString,empId){
       return await this.shiftRepo.find({fields,popultae:{ path: 'transcriptionsId',select: ' performance',},limit,queryStr:{emp:empId},skip,sort:{'createdAt':-1},page} )
    }
     
}
 