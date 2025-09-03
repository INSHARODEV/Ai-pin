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
  Get,
  Query,
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
import { QueryString } from 'src/common/types/queryString.type';
import { PaginationPipe } from 'src/common/pipes/pagination.pipe';
import { SalseDataInteceptor } from './interceptors/data.interceptor';
import { RoleMixin } from '../../common/Mixins/role.mixin';
import { Role } from 'src/shared/ROLES';

@Controller('trasncriptions')
@UseGuards(AuthGuard)
export class TrasncriptionController {
  constructor(
    private readonly trasncriptionService: TrasncriptionService,
    private readonly assmbleyAI: AssmbleyAI,
    private readonly logger: Logger,
    private readonly ChatGpt: ChatGpt,
    private readonly shiftService: shiftService,
  ) {}

  @Post('shift')
  async startShift(@Req() req: Request) {
    const empId = req['user']['_id'];
    const branchId = req['user']['branchId'] as MongoDbId;
    return await this.shiftService.createShift({ emp: empId,branchId });
  }

  @Post(':shiftId')
  @UseInterceptors(FileInterceptor('audio-file'))
  async transcripe(
    @UploadedFile(AudioPipe) { file, fileName }: any,
    @Req() req: Request,
    @Param('shiftId', ParseMongoIdPipe) shiftId: MongoDbId,
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
      await this.shiftService.updateShift(shiftId, newDoc._id);
      console.log(craeteTrasncitionDto)
      return newDoc;
    } catch (error) {
      this.logger.error(
        `Transcription process failed:${error.message}. ${error.stack}`,
      );
      throw error;  
    }
  }

  @Get()
  @UseInterceptors(SalseDataInteceptor)
  async retiveAllShifts(
    @Req() req: Request,
    @Query(PaginationPipe)
    { fields, limit, queryStr, popultae, skip, sort, page }: QueryString,
  ) {
    return await this.shiftService.getAll(
      { fields, limit, queryStr:{emp:req['user']['_id']}, skip, sort, page, popultae },
     
    );
  }
  @Get( )
  @UseGuards(RoleMixin([Role.SUPERVISOR]))
  async getAllTrasnciptions(@Req() req: Request,@Query(){ fields, limit, queryStr, popultae, skip, sort, page }: QueryString,@Param('empId', ParseMongoIdPipe) empId: MongoDbId){
    await this.trasncriptionService.getUserTranscriptions({ fields, limit, queryStr:{branchId:req['user']['branchId']}, popultae:{ path: 'transcriptionsId emp',select: ' performance firstName lastName',}, skip, sort, page },  empId)
  }
}
