import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import {
  createAdminZodSchema,
  createDeliveryPersonnelZodSchema,
  createSenderReceiverZodSchema,
  updateUserBlockedStatusSchema,
  updateUserZodSchema,
} from "./user.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(createSenderReceiverZodSchema),
  UserControllers.createUser
);
router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUsers
);
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);
router.post(
  "/create-admin",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createAdminZodSchema),
  UserControllers.createAdmin
);
router.post(
  "/create-delivery-personnel",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createDeliveryPersonnelZodSchema),
  UserControllers.createDeliveryPersonnel
);
router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getSingleUser
);
router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  validateRequest(updateUserZodSchema),
  UserControllers.updateUser
);

router.patch(
  "/:id/block-user",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateUserBlockedStatusSchema),
  UserControllers.blockStatusUser
);
export const UserRoutes = router;
