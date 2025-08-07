import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL database connected with Prisma!");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
};

export { prisma };
export default connectDB;
