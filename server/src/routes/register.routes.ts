import { Router } from "express";
import registerController from "../controllers/register.controllers";
import { zodValidation } from "../middlewares/zodValidator";
import { registerSchema } from "../schemas/auth.schema";

const router: Router = Router();

router.post("/", zodValidation(registerSchema), registerController);

export default router;
