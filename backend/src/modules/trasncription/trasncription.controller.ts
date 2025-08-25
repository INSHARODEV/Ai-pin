import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Logger,
  Req,
  Inject,
  UseGuards,
  Param,
} from '@nestjs/common';
import { TrasncriptionService } from './trasncription.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AudioPipe } from './pipes/audio.pipe';
import { AssmbleyAI } from './assmbleyAi.service';
import { prompt } from 'src/common/utils/chatGPT.prompt';
import { ChatGpt } from './ChtGPT.servcie';
import { exponentialBackoff } from 'src/common/utils/exponantioateBackoff';
import { createTransiptionDto } from './dto/create-trasition-dto';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth/auth.gurd';
import { shiftService } from './shift.service';
import { ParseMongoIdPipe } from '../../common/pipes/parse-mongodb-id.pipe';
import { MongoDbId } from 'src/common/DTOS/mongodb-Id.dto';

@Controller('trasncriptions')
export class TrasncriptionController {
  constructor(
    private readonly trasncriptionService: TrasncriptionService,
    private readonly assmbleyAI: AssmbleyAI,
    private readonly logger: Logger,
    private readonly ChatGpt: ChatGpt,
    private readonly shiftService: shiftService,
  ) {}

  @Post('shift')
  @UseGuards(AuthGuard)
  async startShift(@Req() req: Request) {
    const empId = req['user']['_id'];
    await this.shiftService.createShift({ emp: empId });
  }

  @Post(':shiftId')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('audio-file'))
  async transcripe(
    @UploadedFile(AudioPipe) { file, fileName }: any,
    @Req() req: Request,
    @Param('shiftId', ParseMongoIdPipe) shiftId: MongoDbId
  ) {
    try {
      this.logger.verbose('audioFile', file);
      // assmbley ai transcition
      const transcribedUrl =
        await this.assmbleyAI.uploadAudioToAssemblyAI(file);
      const transcriptId =
        await this.assmbleyAI.getTranscribedData(transcribedUrl);
      const transcription = await this.assmbleyAI.transcribe(transcriptId);
      //
      const chatGptPrompt = prompt(transcription);
      let craeteTrasncitionDto = await this.ChatGpt.callChatGpt(
        chatGptPrompt,
        chatGptPrompt,
      );
      craeteTrasncitionDto = {
        ...craeteTrasncitionDto,
        status: 'completed',
        raw_transcript: transcription,
        emp: req['user']['_id'],
        audio_url: fileName,
      } as createTransiptionDto;
      const newDoc = await this.trasncriptionService.create(
        craeteTrasncitionDto as createTransiptionDto,
      );
    await  this.shiftService.updateShift(shiftId,newDoc._id)
      return newDoc;
    } catch (error) {
      this.logger.error(`Transcription process failed:${error.message}. ${error.stack}`);
      throw error; // Re-throw to let NestJS handle the response
    }
  }
}
