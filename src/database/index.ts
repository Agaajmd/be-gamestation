import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

// Singleton pattern untuk Prisma Client
declare global {
  var __prisma: PrismaClient | undefined;
  var __pool: Pool | undefined;
}

// Buat atau reuse pool
const pool =
  global.__pool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

if (process.env.NODE_ENV !== "production") {
  global.__pool = pool;
}

// Buat adapter
const adapter = new PrismaPg(pool);

// Buat atau reuse Prisma Client (Singleton)
export const prisma =
  global.__prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    errorFormat: "pretty",
  });

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}

// Cleanup hanya sekali
let isShuttingDown = false;

const cleanup = async () => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  try {
    await prisma.$disconnect();
    await pool.end();
    console.log("Database connections closed");
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
};

// Register cleanup handlers hanya di production atau sekali saja
if (process.env.NODE_ENV === "production") {
  process.once("SIGINT", cleanup);
  process.once("SIGTERM", cleanup);
  process.once("beforeExit", cleanup);
}
