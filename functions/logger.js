import winston from 'winston';
import 'winston-daily-rotate-file';
 
const errorTransport = new (winston.transports.DailyRotateFile)({
  filename: './logs/%DATE%-errors.log',
  maxFiles: '2d',
  level: 'error'
});

const infoTransport = new (winston.transports.DailyRotateFile)({
    filename: './logs/%DATE%-startup.log',
    datePattern: 'YYYY-MM-DD-HH-MM',
    maxFiles: '2d',
    level: 'info',
  });

export default winston.createLogger({
    format: winston.format.json(),
    exitOnError: false,
    transports: [
        errorTransport,
        infoTransport,
        new winston.transports.Console({ level: 'debug', })
    ]
});