import { Router } from "express";
import authController from "../controllers/auth.controllers";
import { zodValidation } from "../middlewares/zodValidator";
import { loginSchema } from "../schemas/auth.schema";

const router: Router = Router();

router.post("/", zodValidation(loginSchema), authController);

export default router;
