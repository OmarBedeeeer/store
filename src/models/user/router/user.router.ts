import { Router } from "express";
import { userAuthController } from "../userAuth/userManage.controller";

const userRouter = Router();

userRouter.post("/register", userAuthController.sginUp);
userRouter.post("/login", userAuthController.LogIn);

export default userRouter;
