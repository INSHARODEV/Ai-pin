import { Module } from '@nestjs/common';
import { TrasncriptionService } from './trasncription.service';
import { TrasncriptionController } from './trasncription.controller';
import {    AssmbleyAI } from './assmbleyAi.service';
import { ChatGpt } from './ChtGPT.servcie';
import { TranscriptionRepo } from './transcrition.repo';
import { Transcript,TranscriptSchema } from './schemas/transcitionSchema';
import { MongooseModule } from '@nestjs/mongoose';
import { BackblazeCloudService } from './BazePlaceUploadService';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Transcript.name, schema: TranscriptSchema   }]),

  ],
  controllers: [TrasncriptionController,],
  providers: [TrasncriptionService,AssmbleyAI,ChatGpt,TranscriptionRepo,BackblazeCloudService],
})
export class TrasncriptionModule {}
