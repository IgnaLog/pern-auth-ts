import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handleNewUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  // Check for duplicate username in the db
  const duplicate = await prisma.user.findUnique({ where: { username } });
  if (duplicate) {
    return res.sendStatus(409); // Conflict
  }
  try {
    // Encrypt the password
    const hashedPwd = await bcrypt.hash(password, 10); // 10 (salt) sets of random characters to form a hash with the password

    // Create and store the new user with their respective initial role
    await prisma.$transaction(async (transaction) => {
      const user = await transaction.user.create({
        data: {
          username,
          password: hashedPwd,
        },
      });
      await transaction.role.create({
        data: {
          userId: user.id,
        },
      });
    });

    res.status(201).json({ success: `New user ${username} created!` });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export default handleNewUser;
