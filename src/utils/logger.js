import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const infoTransport = new DailyRotateFile({
  filename: 'logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  level: 'info',
});

const warnTransport = new DailyRotateFile({
  filename: 'logs/warn-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  level: 'warn',
});

const errorTransport = new DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '30d',
  level: 'error',
});

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, ...meta }) => {
      const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
      return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaStr}`;
    })
  ),
  transports: [
    // new transports.Console({
    //   format: format.combine(
    //     format.printf(({ timestamp, level, message, ...meta }) => {
    //       const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
    //       return `[${timestamp}] ${level}: ${message} ${metaStr}`;
    //     })
    //   ),
    // }),
    infoTransport,
    warnTransport,
    errorTransport,
  ],
});
