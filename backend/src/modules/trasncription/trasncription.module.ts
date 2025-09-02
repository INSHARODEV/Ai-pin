import { Module } from '@nestjs/common';
import { TrasncriptionService } from './trasncription.service';
import { TrasncriptionController } from './trasncription.controller';
import {    AssmbleyAI } from './assmbleyAi.service';
import { ChatGpt } from './ChtGPT.servcie';
import { TranscriptionRepo } from './transcrition.repo';
import { Transcript,TranscriptSchema,Shift,ShfitSchema  } from './schemas/transcitionSchema';
import { MongooseModule } from '@nestjs/mongoose';
import { BackblazeCloudService } from './BazePlaceUploadService';
import { AudioGateway  } from './transcripe.gatway';
import { shiftService } from './shift.service';
import { shiftRepo } from './shift.repo';
import { ShiftController } from './shift.controller';

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Transcript.name, schema: TranscriptSchema   },
      {name: Shift.name, schema:  ShfitSchema  }
    ]),

  ],
  controllers: [TrasncriptionController,ShiftController],
  providers: [TrasncriptionService,AssmbleyAI,ChatGpt,TranscriptionRepo,AudioGateway,BackblazeCloudService,shiftService,shiftRepo],
})
export class TrasncriptionModule {}
