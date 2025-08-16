import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as path from 'path';

const logDir = path.join('src', 'logs');
const logFile = path.join(logDir, 'myLogFile.json');

export async function logToFile(logData: object) {
    try {
        if (!fs.existsSync(logDir)) {
            await fsPromises.mkdir(logDir, { recursive: true });
        }

        const logEntry = JSON.stringify(logData, null, 2) + ',\n';
        await fsPromises.appendFile(logFile, logEntry);
    } catch (error) {
        console.error('Log write error:', error.message);
    }
}

export function formatTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);  
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');  
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}/${day}/${month} ${hours}:${minutes}:${seconds}`;
}