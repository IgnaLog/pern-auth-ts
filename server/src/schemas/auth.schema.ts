import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    username: z.string().nonempty("Username is required"),
    password: z.string().nonempty("Password is required"),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    username: z
      .string()
      .nonempty("Username is required")
      .min(4, "Username must have a minimum of 4 characters")
      .max(24, "Username too long")
      .regex(
        /^[A-z][A-z0-9-_]{3,23}$/,
        "Must begin with a letter. Letters, number, underscores, hyphens allowed."
      ),
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, "Password must have a minimum of 8 characters")
      .max(24, "Password too long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/,
        " Must include uppercase and lowercase letters, a number and a special character. Allowed special characters: ! @ # $ %"
      ),
  }),
});
