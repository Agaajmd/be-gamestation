"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
dotenv_1.default.config();
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in environment variables");
}
console.log("🔌 Connecting to database...");
// Buat atau reuse pool
const pool = global.__pool ||
    new pg_1.Pool({
        connectionString: process.env.DATABASE_URL,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
if (process.env.NODE_ENV !== "production") {
    global.__pool = pool;
}
// Buat adapter
const adapter = new adapter_pg_1.PrismaPg(pool);
// Buat atau reuse Prisma Client (Singleton)
exports.prisma = global.__prisma ||
    new client_1.PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
        errorFormat: "pretty",
    });
if (process.env.NODE_ENV !== "production") {
    global.__prisma = exports.prisma;
}
// Cleanup hanya sekali
let isShuttingDown = false;
const cleanup = async () => {
    if (isShuttingDown)
        return;
    isShuttingDown = true;
    try {
        await exports.prisma.$disconnect();
        await pool.end();
        console.log("Database connections closed");
    }
    catch (error) {
        console.error("Error during cleanup:", error);
    }
};
// Register cleanup handlers hanya di production atau sekali saja
if (process.env.NODE_ENV === "production") {
    process.once("SIGINT", cleanup);
    process.once("SIGTERM", cleanup);
    process.once("beforeExit", cleanup);
}
//# sourceMappingURL=index.js.map