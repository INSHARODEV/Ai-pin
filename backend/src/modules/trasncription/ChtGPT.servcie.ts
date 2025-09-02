import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { exponentialBackoff } from 'src/common/utils/exponantioateBackoff';
import {
  productKeywords,
  offerPatterns,
  acceptancePatterns,
  rejectionPatterns,
} from 'src/common/utils/pattrens';
import { stringfyBody } from 'src/common/utils/stirngfy-body';
import { Turn } from './schemas/transcitionSchema';

@Injectable()
export class ChatGpt {
  constructor(private readonly Logger: Logger) {}
  async callChatGpt(prompt: string, transcript: string) {
    // this.Logger.warn(
    //   `call ing chat gpt with the prompt : ${JSON.stringify(prompt)}`,
    // );
    const url = 'https://api.openai.com/v1/chat/completions';
    const body = stringfyBody(prompt);
    const res = await fetch(url, {
      method: 'POST',
      body,

      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      const body = JSON.stringify(await res.json());
      this.Logger.error(`${body} `);
      throw new BadRequestException(`${body}`);
    }
    this.Logger.debug(`finised the caall then res is ${res}`);
    const data = await res.json();
    let content = data.choices[0].message.content.trim();
    if (content.startsWith('```')) {
      content = content
        .replace(/^```(\w+)?/, '')
        .replace(/```$/, '')
        .trim();
    }
    const parsed = JSON.parse(content);
    this.Logger.warn('the reposen of chat gpt',parsed)
    const turns = parsed.turns as Turn[];
    const performance=parsed.performance

    let summary = parsed.summary;
    if (Array.isArray(summary)) {
      summary = summary.join(' ');
    }
    const { attempted, successful } = this.detectUpselling(transcript, summary);

    if (turns && turns.length > 0) {
      turns.forEach((turn) => {
        if (turn.engagement_metrics) {
          turn.engagement_metrics.upselling_attempted = attempted;
          turn.engagement_metrics.upselling_successful = successful;
        } else {
          turn.engagement_metrics = {
            talk_ratio_rep_pct: 50,
            talk_ratio_cust_pct: 50,
            empathy_word_count: 0,
            avg_response_time_sec: 2,
            upselling_attempted: attempted,
            upselling_successful: successful,
          };
        }
      });
      this.Logger.warn(`parsed data${parsed} and turns: ${turns}  and `);
      return {
        turns,
        summary,
        audio_url: '',

        performance 
      };
    }
  }
  detectUpselling(transcript, summary) {
    const transcriptLower = transcript.toLowerCase();
    const summaryLower = summary?.toLowerCase() || '';

    const hasOffer = offerPatterns.some((pattern) =>
      transcriptLower.includes(pattern),
    );
    const hasAcceptance = acceptancePatterns.some((pattern) =>
      transcriptLower.includes(pattern),
    );
    const hasRejection = rejectionPatterns.some((pattern) =>
      transcriptLower.includes(pattern),
    );
    const hasProduct = productKeywords.some((keyword) =>
      transcriptLower.includes(keyword),
    );

    const summaryIndicatesUpsell =
      summaryLower.includes('upsell') ||
      summaryLower.includes('additional') ||
      summaryLower.includes('extra') ||
      summaryLower.includes('offered') ||
      summaryLower.includes('suggested') ||
      summaryLower.includes('recommended') ||
      summaryLower.includes('bundle') ||
      summaryLower.includes('package');

    const attempted = (hasOffer && hasProduct) || summaryIndicatesUpsell;
    const successful =
      attempted && hasAcceptance && hasProduct && !hasRejection;

    console.log('📊 Detection Results:');
    console.log(
      '- Has Offer:',
      hasOffer,
      offerPatterns.filter((p) => transcriptLower.includes(p)),
    );
    console.log(
      '- Has Acceptance:',
      hasAcceptance,
      acceptancePatterns.filter((p) => transcriptLower.includes(p)),
    );
    console.log(
      '- Has Rejection:',
      hasRejection,
      rejectionPatterns.filter((p) => transcriptLower.includes(p)),
    );
    console.log(
      '- Has Product:',
      hasProduct,
      productKeywords.filter((p) => transcriptLower.includes(p)),
    );
    console.log('- Summary Indicates:', summaryIndicatesUpsell);
    console.log('- Attempted:', attempted);
    console.log('- Successful:', successful);

    return {
      attempted: attempted,
      successful: successful,
    };
  }
}
