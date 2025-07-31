import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { ParcelControllers } from "./parcel.controller";
import {
  createParcelZodSchema,
  updateBlockedStatusSchema,
  updateStatusPersonnelSchema,
} from "./parcel.validation";

const router = Router();
// ==================== SENDER ROUTES ====================
// Route to create a parcel
router.post(
  "/",
  checkAuth(Role.SENDER),
  validateRequest(createParcelZodSchema),
  ParcelControllers.createParcel
);

router.post(
  "/cancel/:id",
  checkAuth(Role.SENDER),
  ParcelControllers.cancelParcel
);
router.get("/me", checkAuth(Role.SENDER), ParcelControllers.getSenderParcels);

router.get(
  "/:id/status-log",
  checkAuth(Role.SENDER),
  ParcelControllers.getParcelWithHistory
);

// ===================== RECEIVER ROUTES ====================

router.get(
  "/me/incoming",
  checkAuth(Role.RECEIVER),
  ParcelControllers.getIncomingParcels
);

router.patch(
  "/confirm/:id",
  checkAuth(Role.RECEIVER),
  ParcelControllers.confirmDelivery
);

router.get(
  "/me/history",
  checkAuth(Role.RECEIVER),
  ParcelControllers.getDeliveryHistory
);

// ==================== ADMIN ROUTES ====================
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ParcelControllers.getAllParcels
);

router.patch(
  "/:id/delivery-status",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateStatusPersonnelSchema),
  ParcelControllers.updateParcelStatus
);

router.patch(
  "/:id/block-status",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateBlockedStatusSchema),
  ParcelControllers.blockStatusParcel
);

// ==================== PUBLIC ROUTES ====================
router.get("/tracking/:trackingId", ParcelControllers.getParcelByTrackingId);

export const ParcelRoutes = router;
