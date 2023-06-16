import { Request, Response } from "express";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/dotenv";
import jwt, { Secret } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handleRefreshToken = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized

    const refreshToken = cookies.jwt;
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });

    // User to whom that unique token belongs
    const foundUser = await prisma.user.findFirst({
      where: {
        refreshTokens: {
          some: {
            token: refreshToken,
          },
        },
      },
      include: {
        roles: { select: { rolename: true, roleId: true } },
      },
    });

    if (!foundUser) {
      // Detected refreshToken reuse!
      try {
        // Investigate
        const decoded: any = jwt.verify(
          refreshToken,
          REFRESH_TOKEN_SECRET as Secret
        );
        const hackedUser = await prisma.user.findUnique({
          where: { username: decoded.username },
        });

        if (hackedUser) {
          // Delete all your refreshTokens
          await prisma.refresh_token.deleteMany({
            where: { userId: hackedUser.id },
          });
        }
      } catch (e) {
        return res.sendStatus(403); // Forbidden
      }
      return res.sendStatus(403); // Forbidden
    }

    // Evaluate jwt
    try {
      const decoded: any = jwt.verify(
        refreshToken,
        REFRESH_TOKEN_SECRET as Secret
      );
      if (foundUser.username !== decoded.username) throw new Error();

      // RefreshToken was still valid
      const roles: number[] = foundUser.roles.map((role) => role.roleId);

      const accessToken = jwt.sign(
        {
          userInfo: {
            username: decoded.username,
            roles: roles,
          },
        },
        ACCESS_TOKEN_SECRET as Secret,
        { expiresIn: "30s" } // Production expiresIn 5-15 min
      );

      const newRefreshToken = jwt.sign(
        { username: foundUser.username },
        REFRESH_TOKEN_SECRET as Secret,
        { expiresIn: "1d" }
      );

      // Delete that used rt and add the new rt for the found user
      await prisma.$transaction([
        prisma.refresh_token.delete({
          where: { token: refreshToken },
        }),
        prisma.refresh_token.create({
          data: {
            token: newRefreshToken,
            userId: foundUser.id,
          },
        }),
      ]);

      // Send the refreshToken and save as a cookie in the browser
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      // Send access token to the frontEnd developer.
      res.json({ accessToken });
    } catch (e) {
      // Expired refreshToken
      // For any errors, delete this used rt
      await prisma.refresh_token.delete({
        where: { token: refreshToken },
      });
      res.sendStatus(403); // Forbidden
    }
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default handleRefreshToken;
