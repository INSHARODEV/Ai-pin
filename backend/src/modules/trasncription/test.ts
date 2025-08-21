// transcription.service.ts
import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import { join } from 'path';
 
@Injectable()
export class TranscriptionService {
  async transcribe(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const pythonPath = join(__dirname, '../../../../faster-wihsper/venv/Scripts/python.exe');  
      const scriptPath = join(__dirname, '../../../../faster-wihsper/test.py');

      const py = spawn(pythonPath, [scriptPath, filePath]);

      let output = '';
      py.stdout.on('data', (data) => (output += data.toString()));
      py.stderr.on('data', (data) => console.error('Python error:', data.toString()));
      py.on('close', (code) => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(new Error('Python process failed'));
        }
      });
    });
  }
}
