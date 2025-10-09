import { Module } from '@nestjs/common';
import { TranscriptionService } from './transcription.service';
import { TranscriptionController } from './transcription.controller';
import { AssmbleyAI } from './assmbleyAi.service';
import { ChatGpt } from './ChtGPT.servcie';
import { TranscriptionRepo } from './transcription.repo';
import {
  Transcript,
  TranscriptSchema,
  Shift,
  ShfitSchema,
} from './schemas/transcitionSchema';
import { MongooseModule } from '@nestjs/mongoose';
import { BackblazeCloudService } from './BazePlaceUploadService';
 import { shiftService } from './shift.service';
import { shiftRepo } from './shift.repo';
import { ShiftController } from './shift.controller';
import { AudioGateway } from './transcripe.gatway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transcript.name, schema: TranscriptSchema },
      { name: Shift.name, schema: ShfitSchema },
    ]),
  ],
  controllers: [TranscriptionController, ShiftController],
  providers: [
    TranscriptionService,
    AssmbleyAI,
    ChatGpt,
    TranscriptionRepo,
  AudioGateway,
    BackblazeCloudService,
    shiftService,
    shiftRepo,
 
  ],
})
export class TranscriptionModule {}
