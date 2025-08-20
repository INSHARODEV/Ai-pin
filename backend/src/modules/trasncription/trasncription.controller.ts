import { Controller, Post, UploadedFile, UseInterceptors, Logger, Req, Inject, UseGuards } from '@nestjs/common';
import { TrasncriptionService } from './trasncription.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AudioPipe } from './pipes/audio.pipe';
import {    AssmbleyAI } from './assmbleyAi.service';
import { prompt } from 'src/common/utils/chatGPT.prompt';
import { ChatGpt } from './ChtGPT.servcie';
import { exponentialBackoff } from 'src/common/utils/exponantioateBackoff';
import { createTransiptionDto } from './dto/create-trasition-dto';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth/auth.gurd';

@Controller('trasncriptions')
export class TrasncriptionController {
  constructor(
    private readonly trasncriptionService: TrasncriptionService,
    private readonly assmbleyAI: AssmbleyAI,
    private readonly logger: Logger,
    private readonly ChatGpt:ChatGpt
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('audio-file'))
  async transcripe(@UploadedFile( AudioPipe) {file,fileName}:any,
@Req() req:Request) {
    try {
      this.logger.verbose('audioFile', file);
      // assmbley ai transcition
      const transcribedUrl = await this.assmbleyAI.uploadAudioToAssemblyAI(file);
      const transcriptId = await this.assmbleyAI.getTranscribedData(transcribedUrl);
      const transcription = await this.assmbleyAI.transcribe(transcriptId);
      //
    const chatGptPrompt=  prompt(transcription)
    let craeteTrasncitionDto= await  this.ChatGpt.callChatGpt(chatGptPrompt,chatGptPrompt) 
    craeteTrasncitionDto={...craeteTrasncitionDto,status:'completed',raw_transcript:transcription,emp:req['user']['_id'],audio_url:fileName}as createTransiptionDto
    const newDoc=  await   this.trasncriptionService.create(craeteTrasncitionDto as createTransiptionDto)
      return newDoc;
    } catch (error) {
      this.logger.error('Transcription process failed:', error);
      throw error; // Re-throw to let NestJS handle the response
    }
  }
}