import { Injectable, Logger } from '@nestjs/common';
import { TranscriptionRepo } from './transcrition.repo';
import { createTransiptionDto } from './dto/create-trasition-dto';

@Injectable()
export class TrasncriptionService {
    constructor(private readonly transcriptionRepo:TranscriptionRepo,
    private readonly logger:Logger
    ){}
  async  create(createTrastioptinDto:createTransiptionDto){
    this.logger.verbose(`recived ${JSON.stringify(createTrastioptinDto)} at ${TrasncriptionService.name}`)
    const Result= await this .transcriptionRepo.create(createTrastioptinDto)
    this.logger.warn(`created ${JSON.stringify(Result)} at ${TrasncriptionService.name}`)

    return Result

  }
  async getUserTranscriptions(userEmail: string, startDate?: Date, endDate?: Date) {
    // Default: 7 days ago to now
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
  
    const fromDate = startDate || sevenDaysAgo;
    const toDate = endDate || now;
  
    const queryStr = {
      userEmail,
      createdAt: {
        $gt: fromDate,
        $lte: toDate
      }
    };
  
    return await this.transcriptionRepo.find({
      limit: 100,
      page: 1,
      queryStr,
      sort: 'asc',
      skip: 0,
      fields: ''
    });
  }
  

}
