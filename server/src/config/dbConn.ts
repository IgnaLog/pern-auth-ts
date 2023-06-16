import { PrismaClient } from "@prisma/client";

(async () => {
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log("Successful connection to the database");
    await prisma.$disconnect();
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
})();
