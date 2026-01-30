// utils/logger.ts
import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  
  // Format untuk production (JSON)
  ...(!isProduction && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
        singleLine: false,
      },
    },
  }),

  // Base fields yang selalu ada
  base: {
    env: process.env.NODE_ENV,
  },

  // Serializers untuk format khusus
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
  },

  // Timestamp format
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Child logger untuk specific context
export const createLogger = (component: string) => {
  return logger.child({ component });
};