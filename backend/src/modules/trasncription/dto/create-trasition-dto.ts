import { IsArray, IsDecimal, IsDefined, isNumber, IsOptional, isString, IsString } from 'class-validator';
import { Turn, TurnSchema } from '../schemas/transcitionSchema';

export class createTransiptionDto {
  @IsArray()
  turns: Turn[];

  @IsString()
  raw_transcript: string;
  @IsDefined()
  performance: any;

  @IsString()
  summary: string;
  @IsString()
  audio_url: string;

  @IsString()
  @IsOptional()
  emp: string;

  @IsString()
  status: string;
}
