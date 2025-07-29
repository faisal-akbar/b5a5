import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import { createAdminZodSchema, createUserZodSchema, updateUserZodSchema } from "./user.validation";

const router = Router()



router.post("/register",
    validateRequest(createUserZodSchema),
    UserControllers.createUser)
router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllUsers)
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe)
router.post("/create-admin", 
    validateRequest(createAdminZodSchema),
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.createAdmin)
router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getSingleUser)
router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserControllers.updateUser)
export const UserRoutes = router