"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const parcel_service_1 = require("./parcel.service");
// ==================== SENDER CONTROLLERS ====================
const createParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Creating parcel delivery request" + req.user);
    const senderId = req.user.userId;
    const parcel = yield parcel_service_1.ParcelService.createParcel(req.body, senderId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel delivery request created successfully",
        data: parcel,
    });
}));
const cancelParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.id;
    const senderId = req.user.userId;
    const { note } = req.body;
    const result = yield parcel_service_1.ParcelService.cancelParcel(senderId, parcelId, note);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel cancelled successfully",
        data: result,
    });
}));
const deleteParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.id;
    const senderId = req.user.userId;
    const result = yield parcel_service_1.ParcelService.deleteParcel(senderId, parcelId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel deleted successfully",
        data: result,
    });
}));
const getSenderParcels = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const senderId = req.user.userId;
    const query = req.query;
    const result = yield parcel_service_1.ParcelService.getSenderParcels(senderId, query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Sender parcels retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getParcelWithHistory = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.user.userId;
    const result = yield parcel_service_1.ParcelService.getParcelWithTrackingHistory(id, userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel details with tracking history retrieved successfully",
        data: result,
    });
}));
// ==================== RECEIVER CONTROLLERS ====================
const getIncomingParcels = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const receiverId = req.user.userId;
    const query = req.query;
    const result = yield parcel_service_1.ParcelService.getIncomingParcels(receiverId, query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Incoming parcels retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const confirmDelivery = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const receiverId = req.user.userId;
    const result = yield parcel_service_1.ParcelService.confirmDelivery(id, receiverId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel delivery confirmed successfully",
        data: result,
    });
}));
const getDeliveryHistory = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const receiverId = req.user.userId;
    const query = req.query;
    const result = yield parcel_service_1.ParcelService.getDeliveryHistory(receiverId, query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Delivery history retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
// ==================== ADMIN CONTROLLERS ====================
const getAllParcels = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield parcel_service_1.ParcelService.getAllParcels(query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "All parcels retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const updateParcelStatus = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const adminId = req.user.userId;
    const result = yield parcel_service_1.ParcelService.updateParcelStatus(id, adminId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel status or delivery personnel updated successfully",
        data: result,
    });
}));
const blockStatusParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const adminId = req.user.userId;
    const { reason, isBlocked } = req.body;
    const result = yield parcel_service_1.ParcelService.blockStatusParcel(id, adminId, {
        reason,
        isBlocked,
    });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: `Parcel ${isBlocked ? "blocked" : "unblocked"} successfully`,
        data: result,
    });
}));
const createParcelByAdmin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = req.user.userId;
    const parcel = yield parcel_service_1.ParcelService.createParcel(req.body, adminId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel created successfully",
        data: parcel,
    });
}));
const getParcelById = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield parcel_service_1.ParcelService.getParcelById(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel details retrieved successfully",
        data: result,
    });
}));
// ==================== PUBLIC CONTROLLERS ====================
const getParcelByTrackingId = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { trackingId } = req.params;
    const result = yield parcel_service_1.ParcelService.getParcelByTrackingId(trackingId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: "Parcel tracking information retrieved successfully",
        data: result,
    });
}));
exports.ParcelControllers = {
    // Sender Controllers
    createParcel,
    cancelParcel,
    deleteParcel,
    getSenderParcels,
    // Receiver Controllers
    getIncomingParcels,
    confirmDelivery,
    getDeliveryHistory,
    // Admin Controllers
    getAllParcels,
    updateParcelStatus,
    blockStatusParcel,
    createParcelByAdmin,
    getParcelById,
    // Public Controllers
    getParcelByTrackingId,
    // Shared Controllers
    getParcelWithHistory,
};
