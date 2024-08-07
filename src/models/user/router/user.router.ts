import { Router } from "express";
import { userAuthController } from "../userAuth/userManage.controller";
import { authentecation } from "../../../models/user/controller/user.auth";

const router = Router();
router.post("/register", userAuthController.sginUp);
router.post("/login", userAuthController.LogIn);
router.post(
  "/user/:id/change-password",
  authentecation,
  userAuthController.changePassword
);
export default router;
