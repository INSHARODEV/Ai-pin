import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import * as path from 'path';
import { BackblazeCloudService } from '../BazePlaceUploadService';
 
@Injectable()
export class AudioPipe implements PipeTransform {
  constructor(private readonly b2Service: BackblazeCloudService) {}

  async transform(file: any) {
    if (!file || !file.buffer || !file.originalname) {
      throw new BadRequestException('No file uploaded');
    }

    // OPTIONAL: Check file signature (magic number)
    const videoBuffer = file.buffer.slice(0, 8);
    const magicNumber = Array.from(new Uint8Array(videoBuffer))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join(' ');

    // const validMagicNumbers = [
    //   '30 26 b2 75 8e 66 cf 11',  // WMV
    //   '00 00 00 18 66 74 79 70',  // MP4
    // ];
    // if (!validMagicNumbers.includes(magicNumber)) {
    //   throw new BadRequestException('Only .mp4 and .wmv videos are supported');
    // }

    // Prepare filename
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}${fileExt}`;

    console.log(fileName);
    
    try {
      console.log('📤 Uploading file via pipe...');
      const uploadResult = await this.b2Service.uploadBuffer(file.buffer, fileName);
      console.log('✅ Upload result in pipe:', uploadResult);

      // ✅ Use the fileUrl that the service already constructed for you
      return {
        fileName: uploadResult.fileName, // Use the fileName from the result
        fileId: uploadResult.fileId,
        fileUrl: uploadResult.fileUrl, 
        file  // ✅ This is already correct!
      };
    } catch (error) {
      console.error('❌ Upload failed in pipe:', error);
      throw new BadRequestException('Failed to upload audio file');
    }
  }
}