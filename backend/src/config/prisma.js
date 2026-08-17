import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

export async function testConnection() {
  await prisma.$queryRaw`SELECT 1`;
  return true;
}

export async function disconnect() {
  await prisma.$disconnect();
  await pool.end();
}

export { prisma, pool };
export default prisma;
