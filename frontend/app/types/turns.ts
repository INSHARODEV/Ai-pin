export type Turn = {
    transcription: string;
    speaker_label: string;
    tone_sentiment: string;
    sales_script_adherence: number;
    compliance_flags: {
      profanity: boolean;
      rude_language: boolean;
      
      non_compliant_promises: boolean;
      unapproved_discounts: boolean;
      missed_greeting_or_closing: boolean;
    };
    engagement_metrics: {
      talk_ratio_rep_pct: number;
      talk_ratio_cust_pct: number;
      empathy_word_count: number;
      avg_response_time_sec: number;
      upselling_attempted:boolean;
      upselling_successful:boolean;
      
    };
  };