import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/dotenv";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handleLogin = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;
    const { username, password } = req.body;

    const foundUser = await prisma.user.findUnique({
      where: { username },
      include: {
        roles: { select: { rolename: true, roleId: true } },
      },
    });

    if (!foundUser) {
      return res.sendStatus(401); // Unauthorized
    }
    // Evaluate password
    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
      // Format transformation after getting the results of the roles
      const roles = foundUser.roles.map(({ rolename, roleId }) => ({
        [rolename]: roleId,
      }));
      // Create JWTs
      const accessToken = jwt.sign(
        {
          userInfo: {
            username: foundUser.username,
            roles: roles,
          },
        },
        ACCESS_TOKEN_SECRET as Secret,
        { expiresIn: "10s" } // Production expiresIn 5-15 min
      );
      const newRefreshToken = jwt.sign(
        { username: foundUser.username },
        REFRESH_TOKEN_SECRET as Secret,
        { expiresIn: "1d" }
      );

      // If that cookie exists:
      if (cookies?.jwt) {
        /*
      Scenario added here:
        1) User logs in but never uses RT and does not logout
        2) RT is stolen
        3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
      */
        const foundToken = await prisma.refresh_token.findUnique({
          where: { token: cookies.jwt },
        });
        // Detected refresh token reuse!
        if (!foundToken) {
          // Attempted refresh token reuse at login!
          // Clear out ALL previous refresh tokens and add de new rt
          await prisma.$transaction([
            prisma.refresh_token.deleteMany({
              where: { userId: foundUser.id },
            }),
            prisma.refresh_token.create({
              data: {
                token: newRefreshToken,
                userId: foundUser.id,
              },
            }),
          ]);
        } else {
          // Remove the old and put the new rt
          await prisma.$transaction([
            prisma.refresh_token.delete({
              where: { token: cookies.jwt },
            }),
            prisma.refresh_token.create({
              data: {
                token: newRefreshToken,
                userId: foundUser.id,
              },
            }),
          ]);
        }
        // Send the order to delete the cookie jwt from the browser
        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
      } else {
        // If there is no jwt cookie, we keep the set of rt in database and add the new rt
        await prisma.refresh_token.create({
          data: {
            token: newRefreshToken,
            userId: foundUser.id,
          },
        });
      }
      // Send tokens to the frontEnd developer.
      // Send the refreshToken and save as a cookie in the browser.
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true, // With 'httpOnly' it will only be accessible from an http request, not from a javascript, which makes it more secure
        sameSite: "none", // None: The cookie will be sent with requests made from any site, including requests from third parties.
        secure: true, // The cookie will only be sent over a secure connection (https) (Only use in production)
        maxAge: 24 * 60 * 60 * 1000, // 1d in milliseconds
      });
      // Send the accessToken
      res.json({ accessToken });
    } else {
      res.sendStatus(401); // Unauthorized
    }
  } catch (e) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default handleLogin;
