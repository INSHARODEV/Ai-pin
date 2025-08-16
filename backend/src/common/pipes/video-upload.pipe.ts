// import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
// import * as fs from 'fs';
// import * as path from 'path';
// import { v4 as uuidv4 } from 'uuid';
// import { Writable } from 'stream';

// @Injectable()
// export class VideoPipe implements PipeTransform {
//   async transform(file: any) {
//     if (!file || !file.buffer || !file.originalname) {
//       throw new BadRequestException('No file uploaded');
//     }

//      const videoBuffer = file.buffer.slice(0, 8);
//     const magicNumber = Array.from(new Uint8Array(videoBuffer))
//       .map((byte) => byte.toString(16).padStart(2, '0'))
//       .join(' ');

//     const validMagicNumbers = [
//       '30 26 b2 75 8e 66 cf 11',  
//       '00 00 00 18 66 74 79 70',  
//     ];

//     if (!validMagicNumbers.includes(magicNumber)) {
//       throw new BadRequestException('Valid video types are .mp4 and .wmv');
//     }

//     // Create uploads directory if it doesn't exist
//     const uploadDir = path.resolve(__dirname, '../../../uploads');
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//      const fileExt = path.extname(file.originalname);
//     const fileName = `${uuidv4()}${fileExt}`;
//     const filePath = path.join(uploadDir, fileName);

    
//     const writeStream = fs.createWriteStream(filePath);
//     const bufferStream = new Writable();

//     bufferStream._write = function (chunk, encoding, callback) {
//       writeStream.write(chunk, encoding, callback);
//     };

//      bufferStream.write(file.buffer);
//     bufferStream.end();

//      return filePath;
//   }
// }
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
// Remove the import of uuid if the module is not installed or available
// import { v4 as uuidv4 } from 'uuid';
import { randomUUID } from 'crypto';

@Injectable()
export class VideoPipe implements PipeTransform {
  async transform(file: any) {
    if (!file || !file.buffer || !file.originalname) {
      throw new BadRequestException('No file uploaded');
    }

    // Check magic numbers for MP4 and WMV
    const videoBuffer = file.buffer.slice(0, 8);
    const magicNumber = Array.from(new Uint8Array(videoBuffer))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join(' ');

    const validMagicNumbers = [
      '30 26 b2 75 8e 66 cf 11',  // WMV
      '00 00 00 18 66 74 79 70',  // MP4
    ];

    if (!validMagicNumbers.includes(magicNumber)) {
      throw new BadRequestException('Only .mp4 and .wmv videos are supported');
    }

    // Create upload directory if not exists
    const uploadDir = path.resolve(__dirname, '../../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileExt = path.extname(file.originalname);
    const fileName = `${randomUUID()}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    // Save file to disk directly
    await fs.promises.writeFile(filePath, file.buffer);

    return filePath;
  }
}
