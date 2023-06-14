import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handleLogout = async (req: Request, res: Response) => {
  try {
    // On client, also delete the accessToken
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.sendStatus(204); // No content
    }
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundToken = await prisma.refresh_token.findFirst({
      where: { token: refreshToken },
    });

    if (!foundToken) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res.sendStatus(204); // Successful, No content
    }

    // Delete refreshToken in db. We keep the refresh tokens that were in the array minus the one used
    await prisma.refresh_token.delete({
      where: { id: foundToken.id },
    });

    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    res.sendStatus(204);
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default handleLogout;
