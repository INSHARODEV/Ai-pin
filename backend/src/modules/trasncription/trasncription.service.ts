import { Injectable, Logger } from '@nestjs/common';
import { TranscriptionRepo } from './transcrition.repo';
import { createTransiptionDto } from './dto/create-trasition-dto';
 import { MongoDbId } from 'src/common/DTOS/mongodb-Id.dto';
import { QueryString } from 'src/common/types/queryString.type';
import { Transcript } from './schemas/transcitionSchema';
import { BackblazeCloudService } from './BazePlaceUploadService';

@Injectable()
export class TrasncriptionService {
    constructor(private readonly transcriptionRepo:TranscriptionRepo,
    private readonly logger:Logger,
    private readonly backblazeCloudService:BackblazeCloudService
    ){}
  async  create(createTrastioptinDto:createTransiptionDto){
    this.logger.verbose(`recived ${JSON.stringify(createTrastioptinDto)} at ${TrasncriptionService.name}`)
    const Result= await this .transcriptionRepo.create(createTrastioptinDto)
    this.logger.warn(`created ${JSON.stringify(Result)} at ${TrasncriptionService.name}`)

    return Result

  }
  async getUserTranscriptions(
    { fields, limit, queryStr: ss, skip, sort, page, popultae }: QueryString,
    userEmail: MongoDbId,
  ) {
    // Default: 7 days ago to now
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
  
    const fromDate = ss.startDate || sevenDaysAgo;
    const toDate = ss.endDate || now;
  
    const queryStr = {
      emp: userEmail,
      createdAt: {
        $gt: fromDate,
        $lte: toDate,
      },
    };
  
    let data = await this.transcriptionRepo.find({
      limit: 100,
      page: 1,
      popultae: '',
      queryStr,
      sort: 'asc',
      skip: 0,
      fields: '',
    });
  
    // ✅ Resolve audio_url for each transcription
    const resolved = await Promise.all(
      (data.data as Transcript[]).map(async d => {
        const audioUrl = await this.backblazeCloudService.getSignedFileUrl(d.audio_url);
        return { ...d, audio_url: audioUrl };
      }),
    );
  
    data.data = resolved;
  
    this.logger.verbose(
      `Fetched ${resolved.length} transcriptions for user ${userEmail}`,
    );
  
    return data;
  }
  


}
