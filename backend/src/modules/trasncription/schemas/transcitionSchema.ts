import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type TranscriptDocument = Transcript & Document;

@Schema({ _id: false })
export class EngagementMetrics {
  @Prop()
  talk_ratio_rep_pct: number;

  @Prop()
  talk_ratio_cust_pct: number;

  @Prop()
  empathy_word_count: number;

  @Prop()
  avg_response_time_sec: number;

  @Prop()
  upselling_attempted: boolean;

  @Prop()
  upselling_successful: boolean;
}

export const EngagementMetricsSchema =
  SchemaFactory.createForClass(EngagementMetrics);

@Schema({ _id: false })
export class ComplianceFlags {
  @Prop()
  profanity: boolean;

  @Prop()
  rude_language: boolean;

  @Prop()
  non_compliant_promises: boolean;

  @Prop()
  unapproved_discounts: boolean;

  @Prop()
  missed_greeting_or_closing: boolean;
}

export const ComplianceFlagsSchema =
  SchemaFactory.createForClass(ComplianceFlags);

@Schema({ _id: false })
export class Turn {
  @Prop()
  transcription: string;

  @Prop()
  speaker_label: string;

  @Prop()
  tone_sentiment: string;

  @Prop()
  sales_script_adherence: number;

  @Prop({ type: ComplianceFlagsSchema })
  compliance_flags: ComplianceFlags;

  @Prop({ type: EngagementMetricsSchema })
  engagement_metrics: EngagementMetrics;
}

export const TurnSchema = SchemaFactory.createForClass(Turn);

@Schema({ timestamps: true })
export class Transcript {
  @Prop({ type: [TurnSchema] })
  turns: Turn[];

  @Prop()
  raw_transcript: string;

  @Prop()
  summary: string;

  @Prop()
  audio_url: string;

  @Prop({ type: mongoose.Schema.ObjectId, ref: 'User' })
  emp: string;

  @Prop({
    type: String,
    enum: ['recording', 'completed', 'processing', 'failed'],
    default: 'recording',
  })
  status: string;
}

export const TranscriptSchema = SchemaFactory.createForClass(Transcript);
