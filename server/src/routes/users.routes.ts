import { Router } from "express";
import ROLES_LIST from "../config/rolesList";
import verifyRoles from "../middlewares/verifyRoles";
import {
  getAllUsers,
  deleteUser,
  getUser,
} from "../controllers/users.controllers";
import { zodValidation } from "../middlewares/zodValidator";
import { deleteUserSchema, getUserSchema } from "../schemas/users.shema";

const router: Router = Router();

router.get("/", verifyRoles(ROLES_LIST.ADMIN), getAllUsers);
router.get(
  "/:id",
  verifyRoles(ROLES_LIST.ADMIN),
  zodValidation(getUserSchema),
  getUser
);
router.delete(
  "/",
  verifyRoles(ROLES_LIST.ADMIN),
  zodValidation(deleteUserSchema),
  deleteUser
);

export default router;
