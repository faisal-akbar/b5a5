"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middlewares/checkAuth");
const validateRequest_1 = require("../../middlewares/validateRequest");
const user_interface_1 = require("../user/user.interface");
const parcel_controller_1 = require("./parcel.controller");
const parcel_validation_1 = require("./parcel.validation");
const router = (0, express_1.Router)();
// ==================== SENDER ROUTES ====================
// create a parcel
router.post("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SENDER), (0, validateRequest_1.validateRequest)(parcel_validation_1.createParcelZodSchema), parcel_controller_1.ParcelControllers.createParcel);
// Cancel a parcel
router.post("/cancel/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SENDER), parcel_controller_1.ParcelControllers.cancelParcel);
// delete a parcel
router.post("/delete/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SENDER), parcel_controller_1.ParcelControllers.deleteParcel);
// View all sender's parcels
router.get("/me", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SENDER), parcel_controller_1.ParcelControllers.getSenderParcels);
// View a specific parcel by ID
router.get("/:id/status-log", (0, checkAuth_1.checkAuth)(user_interface_1.Role.SENDER), parcel_controller_1.ParcelControllers.getParcelWithHistory);
// ===================== RECEIVER ROUTES ====================
// View receiver's incoming parcels
router.get("/me/incoming", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RECEIVER), parcel_controller_1.ParcelControllers.getIncomingParcels);
// Confirm delivery of a specific parcel by ID
router.patch("/confirm/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RECEIVER), parcel_controller_1.ParcelControllers.confirmDelivery);
// View delivery history
router.get("/me/history", (0, checkAuth_1.checkAuth)(user_interface_1.Role.RECEIVER), parcel_controller_1.ParcelControllers.getDeliveryHistory);
// ==================== ADMIN ROUTES ====================
// View all parcels
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), parcel_controller_1.ParcelControllers.getAllParcels);
// Create a parcel by admin if needed
router.post("/create-parcel", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(parcel_validation_1.createParcelByAdminZodSchema), parcel_controller_1.ParcelControllers.createParcelByAdmin);
// Update a parcel delivery status and assign delivery personnel if needed
router.patch("/:id/delivery-status", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(parcel_validation_1.updateStatusPersonnelSchema), parcel_controller_1.ParcelControllers.updateParcelStatus);
// Update a parcel's blocked status
router.patch("/:id/block-status", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), (0, validateRequest_1.validateRequest)(parcel_validation_1.updateBlockedStatusSchema), parcel_controller_1.ParcelControllers.blockStatusParcel);
// View a specific parcel by ID with full details
router.get("/:id/details", (0, checkAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), parcel_controller_1.ParcelControllers.getParcelById);
// ==================== PUBLIC ROUTES ====================
// Track a parcel by tracking ID with limited information
router.get("/tracking/:trackingId", parcel_controller_1.ParcelControllers.getParcelByTrackingId);
exports.ParcelRoutes = router;
