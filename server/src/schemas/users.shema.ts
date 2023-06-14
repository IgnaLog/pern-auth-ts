import { z } from "zod";

export const deleteUserSchema = z.object({
  body: z.object({
    id: z.string().nonempty("User ID required"),
  }),
});

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().nonempty("User ID required"),
  }),
});
