"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = exports.logger = void 0;
// utils/logger.ts
const pino_1 = __importDefault(require("pino"));
const isProduction = process.env.NODE_ENV === 'production';
exports.logger = (0, pino_1.default)({
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
        err: pino_1.default.stdSerializers.err,
        error: pino_1.default.stdSerializers.err,
    },
    // Timestamp format
    timestamp: pino_1.default.stdTimeFunctions.isoTime,
});
// Child logger untuk specific context
const createLogger = (component) => {
    return exports.logger.child({ component });
};
exports.createLogger = createLogger;
//# sourceMappingURL=logger.js.map