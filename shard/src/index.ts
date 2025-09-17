export enum Role {
    MANAGER = "MANAGER",
    ADMIN = "ADMIN",
    SUPERVISOR = "SUPERVISOR",
    SELLER = "SELLER",
  }
  
   
  export type ID = {
    _id: string;
  };
  
  export type Branch = {
    id: string;
    name: string;
    slug?: string;
  };
  
  export type Company = {
    id: string;
    name: string;
    branches: ID[];
  };
  
  export interface QueryString {
    fields: string;
    page?: number;
    limit: number;
    skip: number;
    sort: any;
    queryStr: any;
    populate?: any;
  }
  
  export type Shift = {
    id: string;
    emp: ID;
    transcriptionsId: ID[];
    branchId: ID;
  };
  
  export type EngagementMetrics = {
    talk_ratio_rep_pct: number;
    talk_ratio_cust_pct: number;
    empathy_word_count: number;
    avg_response_time_sec: number;
    upselling_attempted: boolean;
    upselling_successful: boolean;
  };
  
  export type ComplianceFlags = {
    profanity: boolean;
    rude_language: boolean;
    non_compliant_promises: boolean;
    unapproved_discounts: boolean;
    missed_greeting_or_closing: boolean;
  };
  
  export type Turn = {
    transcription: string;
    speaker_label: string;
    tone_sentiment: string;
    sales_script_adherence: number;
    compliance_flags: ComplianceFlags;
    engagement_metrics: EngagementMetrics;
  };
  
  export type Transcript = {
    id: string;
    turns: Turn[];
    raw_transcript: string;
    performance: number;
    summary: string;
    audio_url: string;
    status: "recording" | "completed" | "processing" | "failed";
    emp: ID;
  };
  
  export type User = {
    id: string;
    firstName: string;
    lastName?: string;
    image?: string;
    email: string;
    role: Role;
    permissions?: string[];
    slug: string;
  };
  
  export type Employee = User & {
    branchId: ID;
  };
 
  
  export interface PaginatedData   {
    data: unknown;
    numberOfPages: number;
    page: number;
  };