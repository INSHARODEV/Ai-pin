export const prompt=(transcript)=>{
    return  `
    You are an advanced conversation analysis assistant for retail store interactions.
    Analyze the transcript and return ONLY a JSON object with this exact structure:
    
    {
    
    
      "turns": [
        {
          "transcription": "<exact words spoken>",
          "speaker_label": "Sales Rep" or "Customer",
          "tone_sentiment": "friendly" | "neutral" | "confused" | "frustrated" | "aggressive",
          
          "sales_script_adherence": <0-100 integer>,
          "compliance_flags": {
            "profanity": false,
            "rude_language": false,
            "non_compliant_promises": false,
            "unapproved_discounts": false,
            "missed_greeting_or_closing": false
          },
          "engagement_metrics": {
            "talk_ratio_rep_pct": <percentage>,
            "talk_ratio_cust_pct": <percentage>,
            "empathy_word_count": <count of empathy words like "understand", "sorry", "help">,
            "avg_response_time_sec": <estimated seconds>,
            "upselling_attempted": false,
            "upselling_successful": false
          }
        }
      ],
      "summary": "Conversation summary focusing on customer needs, products discussed, and outcome.",
       "performance": 0,
    }
    
    CRITICAL RULES:
    - Return ONLY valid JSON (no markdown, no explanations)
    - Each speaker turn gets its own object in "turns" array
    - Always include ALL required fields with proper data types
    - Identify speakers as "Sales Rep" or "Customer" based on context
    - Set upselling fields to false (will be overridden by our detection)
    -IMPORTANT: Always include "performance" at the top level as an integer between 0 and 100.
    - If unsure, set "performance" = 0.

    
    Transcript to analyze: ${transcript}`;
}