import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { ParcelControllers } from "./parcel.controller";
import {
  createParcelByAdminZodSchema,
  createParcelZodSchema,
  updateBlockedStatusSchema,
  updateStatusPersonnelSchema,
} from "./parcel.validation";

const router = Router();
// ==================== SENDER ROUTES ====================
// create a parcel
router.post(
  "/",
  checkAuth(Role.SENDER),
  validateRequest(createParcelZodSchema),
  ParcelControllers.createParcel
);

// Cancel a parcel
router.post(
  "/cancel/:id",
  checkAuth(Role.SENDER),
  ParcelControllers.cancelParcel
);

// delete a parcel
router.post(
  "/delete/:id",
  checkAuth(Role.SENDER),
  ParcelControllers.deleteParcel
);

// View all sender's parcels
router.get("/me", checkAuth(Role.SENDER), ParcelControllers.getSenderParcels);

// View a specific parcel by ID
router.get(
  "/:id/status-log",
  checkAuth(Role.SENDER),
  ParcelControllers.getParcelWithHistory
);

// ===================== RECEIVER ROUTES ====================

// View receiver's incoming parcels
router.get(
  "/me/incoming",
  checkAuth(Role.RECEIVER),
  ParcelControllers.getIncomingParcels
);

// Confirm delivery of a specific parcel by ID
router.patch(
  "/confirm/:id",
  checkAuth(Role.RECEIVER),
  ParcelControllers.confirmDelivery
);

// View delivery history
router.get(
  "/me/history",
  checkAuth(Role.RECEIVER),
  ParcelControllers.getDeliveryHistory
);

// ==================== ADMIN ROUTES ====================

// View all parcels
router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ParcelControllers.getAllParcels
);

// Create a parcel by admin if needed
router.post(
  "/create-parcel",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createParcelByAdminZodSchema),
  ParcelControllers.createParcelByAdmin
);

// Update a parcel delivery status and assign delivery personnel if needed
router.patch(
  "/:id/delivery-status",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateStatusPersonnelSchema),
  ParcelControllers.updateParcelStatus
);

// Update a parcel's blocked status
router.patch(
  "/:id/block-status",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateBlockedStatusSchema),
  ParcelControllers.blockStatusParcel
);

// View a specific parcel by ID with full details
router.get(
  "/:id/details",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ParcelControllers.getParcelById
);

// ==================== PUBLIC ROUTES ====================
// Track a parcel by tracking ID with limited information
router.get("/tracking/:trackingId", ParcelControllers.getParcelByTrackingId);

export const ParcelRoutes = router;
