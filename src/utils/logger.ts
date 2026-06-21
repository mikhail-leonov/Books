import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';
import readline from 'readline';

const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const rotateTransport = new DailyRotateFile({
    filename: path.join(logDir, 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
    level: 'info'
});

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.json()),
    transports: [
        new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
        rotateTransport,
        new winston.transports.Console({ format: winston.format.simple() })
    ]
});

export async function getRecentLogs(lines: number = 100): Promise<string[]> {
    const files = fs.readdirSync(logDir)
        .filter(f => f.startsWith('application-') && f.endsWith('.log'))
        .sort()
        .reverse();
    if (files.length === 0) return [];
    const logFile = path.join(logDir, files[0]);
    const fileStream = fs.createReadStream(logFile);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    const buffer: string[] = [];
    for await (const line of rl) {
        buffer.push(line);
        if (buffer.length > lines) buffer.shift();
    }
    return buffer;
}