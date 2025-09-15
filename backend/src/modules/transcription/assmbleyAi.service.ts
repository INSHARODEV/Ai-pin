import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

@Injectable()
export class AssmbleyAI {
  constructor(private readonly logger: Logger) {}

  async uploadAudioToAssemblyAI(file: any) {
    if (!file) {
      this.logger.error('no file path provided for the assembly service');
      throw new BadRequestException('no file path provided for the assembly service');
    }

    try {
      this.logger.verbose('uploading file', file);
      
      const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        body: file.buffer,
        headers: {
          'authorization': process.env.ASSMBLEY_AI_API_KEY as string,  
        },
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        this.logger.error('Upload failed:', errorData);
        throw new InternalServerErrorException('Failed to upload audio file');
      }

      const data = await uploadResponse.json();
      this.logger.verbose('upload data', data);
      return data.upload_url;
    } catch (err) {
      this.logger.error('Upload error:', err);
      throw new InternalServerErrorException('Failed to upload audio file');
    }
  }

  async getTranscribedData(transcribedUrl: string) {
    this.logger.verbose('transcribedUrl', transcribedUrl);
    
   

    try {
      const transcribedData = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        body: JSON.stringify({
          audio_url: transcribedUrl,
          speech_model: 'universal', 
      
          language_code: 'ar', 
        
        }),
        headers: {
          authorization: process.env.ASSMBLEY_AI_API_KEY as string,
          'content-type': 'application/json',  
        },
      });

      if (!transcribedData.ok) {
        const errorData = await transcribedData.json();
        this.logger.error('Transcription request failed:', errorData);
        throw new InternalServerErrorException('Failed to request transcription');
      }

      const data = await transcribedData.json();
      return data.id;
    } catch (err) {
      this.logger.error('Transcription request error:', err);
      throw new InternalServerErrorException('Failed to request transcription');
    }
  }

  async transcribe(transcriptId: string): Promise<string> {
  //  this.logger.verbose('transcriptId', transcriptId);
    
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    const pollInterval = 30000; // 5 seconds
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
          method: 'GET',
          headers: {
            authorization: process.env.ASSMBLEY_AI_API_KEY as string,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          this.logger.error('Transcription fetch failed:', errorData);
          throw new InternalServerErrorException('Failed to fetch transcription');
        }

        const data = await response.json();
       // this.logger.verbose(`Transcription status (attempt ${attempt}):`, data.status);

        if (data.status === 'completed') {
           this.logger.verbose('data',data.text)
          return data.text  ;
        } else if (data.status === 'error') {
          this.logger.error('Transcription failed:', data.error);
          throw new InternalServerErrorException(`Transcription failed: ${data.error}`);
        } else {
          // Status is 'queued' or 'processing'
          if (attempt < maxAttempts) {
            this.logger.log(`Transcription in progress (${data.status}), waiting ${pollInterval/1000} seconds... (attempt ${attempt}/${maxAttempts})`);
            await new Promise((resolve) => setTimeout(resolve, pollInterval));
          }
        }
      } catch (err) {
        this.logger.error(`Transcription error on attempt ${attempt}:`, err);
        if (attempt === maxAttempts) {
          throw new InternalServerErrorException('Failed to get transcription after maximum attempts');
        }
        // Wait before retrying on error
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
      }
    }
    
    throw new InternalServerErrorException('Transcription timeout: exceeded maximum polling attempts');
  }
}
