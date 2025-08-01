import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { AuthControllers } from "./auth.controller";

const router = Router()

router.post("/login", AuthControllers.credentialsLogin)
router.post("/refresh-token", AuthControllers.getNewAccessToken)
router.post("/logout", AuthControllers.logout)
router.post("/change-password", checkAuth(...Object.values(Role)), AuthControllers.changePassword)
router.post("/forgot-password", AuthControllers.forgotPassword)
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthControllers.resetPassword)


export const AuthRoutes = router;