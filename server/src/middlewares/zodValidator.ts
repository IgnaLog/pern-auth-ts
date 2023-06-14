import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

export const zodValidation =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
        header: req.header,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.issues);
        return res.status(400).json(
          error.issues.map((issue) => ({
            path: issue.path,
            message: issue.message,
          }))
        );
      }
      return res.status(400).json({ message: "Internal Server Error" });
    }
  };
