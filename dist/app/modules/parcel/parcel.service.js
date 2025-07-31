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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = require("mongoose");
const QueryBuilder_1 = require("../../utils/builder/QueryBuilder");
const AppError_1 = __importDefault(require("../../utils/errorHelpers/AppError"));
const generateTrackingId_1 = require("../../utils/generateTrackingId");
const coupon_utils_1 = require("../coupon/coupon.utils");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const parcel_interface_1 = require("./parcel.interface");
const parcel_model_1 = require("./parcel.model");
const parcel_utils_1 = require("./parcel.utils");
const addStatusLog = (parcel, status, updatedBy, location, note) => {
    const statusLogEntry = {
        status,
        location: location || "",
        note: note || "Updated by System",
        updatedBy: updatedBy,
    };
    if (!parcel.statusLog) {
        parcel.statusLog = [];
    }
    parcel.statusLog.push(statusLogEntry);
};
// ==================== SENDER SERVICES ====================
const createParcel = (payload, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    const trackingId = (0, generateTrackingId_1.generateTrackingId)();
    const { weight, receiverEmail, pickupAddress, deliveryAddress } = payload, rest = __rest(payload, ["weight", "receiverEmail", "pickupAddress", "deliveryAddress"]);
    // Sender validation
    const sender = yield user_model_1.User.findById(senderId);
    if (!(sender === null || sender === void 0 ? void 0 : sender.phone)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please Update your phone number in your profile.");
    }
    const senderAddress = pickupAddress || sender.defaultAddress;
    if (!senderAddress) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Pickup address is required or set a default address in your profile.");
    }
    // Receiver validation
    const receiver = yield user_model_1.User.findOne({ email: receiverEmail });
    if (!receiver) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receiver account is not found");
    }
    if (receiver.role !== user_interface_1.Role.RECEIVER) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Provided user is not a receiver");
    }
    if (!receiver.isVerified) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receiver is not verified, you cannot send parcel to this receiver");
    }
    if (receiver.isActive === user_interface_1.IsActive.BLOCKED ||
        receiver.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Receiver is ${receiver.isActive}. You cannot send parcel to this receiver`);
    }
    if (receiver.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Receiver is deleted. You cannot send parcel to this receiver`);
    }
    const receiverAddress = deliveryAddress || receiver.defaultAddress;
    if (!receiverAddress) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Delivery address is required or request receiver to add a default address in their profile.");
    }
    const parcelType = rest.type || parcel_interface_1.ParcelType.PACKAGE;
    const shippingType = rest.shippingType || parcel_interface_1.ShippingType.STANDARD;
    if (rest.couponCode) {
        yield (0, coupon_utils_1.validateCoupon)(rest.couponCode);
    }
    const calcParcelFeeWithoutDiscount = (0, parcel_utils_1.calculateParcelFee)(weight, parcelType, shippingType);
    const finalFee = rest.couponCode
        ? yield (0, coupon_utils_1.applyCoupon)(rest.couponCode, calcParcelFeeWithoutDiscount)
        : calcParcelFeeWithoutDiscount;
    const estimatedDeliveryDate = (0, parcel_utils_1.expectedDeliveryDate)(shippingType);
    const parcel = yield parcel_model_1.Parcel.create(Object.assign({ trackingId, type: parcelType, shippingType,
        weight, sender: senderId, receiver: receiver._id, fee: finalFee, currentStatus: parcel_interface_1.ParcelStatus.REQUESTED, statusLog: [
            {
                status: parcel_interface_1.ParcelStatus.REQUESTED,
                location: senderAddress,
                note: "Parcel request created by sender",
                timestamp: new Date(),
                updatedBy: new mongoose_1.Types.ObjectId(senderId),
            },
        ], pickupAddress: senderAddress, deliveryAddress: receiverAddress, estimatedDelivery: estimatedDeliveryDate, couponCode: rest.couponCode }, rest));
    // Fetch the created parcel with excluded fields for privacy
    const cleanParcel = yield parcel_model_1.Parcel.findById(parcel._id)
        .select("-receiver -statusLog._id -deliveryPersonnel")
        .populate("sender", "name email phone _id")
        .populate("receiver", "name email phone -_id")
        .populate("statusLog.updatedBy", "name role -_id");
    return cleanParcel;
});
const cancelParcel = (senderId, id, note) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(id);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    // Check if sender owns this parcel
    if (parcel.sender.toString() !== senderId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to cancel this parcel");
    }
    // check if parcel is already delivered or cancelled
    if (parcel.currentStatus === parcel_interface_1.ParcelStatus.CANCELLED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Parcel is already cancelled");
    }
    if (parcel.currentStatus === parcel_interface_1.ParcelStatus.DELIVERED ||
        parcel.currentStatus === parcel_interface_1.ParcelStatus.DISPATCHED ||
        parcel.currentStatus === parcel_interface_1.ParcelStatus.IN_TRANSIT ||
        parcel.currentStatus === parcel_interface_1.ParcelStatus.PICKED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Parcel cannot be cancelled at this stage");
    }
    if (parcel.currentStatus === parcel_interface_1.ParcelStatus.BLOCKED) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Cannot cancel blocked parcel");
    }
    if (parcel.currentStatus === parcel_interface_1.ParcelStatus.RETURNED) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Cannot cancel returned parcel");
    }
    // Update parcel status and add tracking event
    parcel.currentStatus = parcel_interface_1.ParcelStatus.CANCELLED;
    parcel.estimatedDelivery = null;
    parcel.deliveredAt = null;
    parcel.cancelledAt = new Date();
    addStatusLog(parcel, parcel_interface_1.ParcelStatus.CANCELLED, new mongoose_1.Types.ObjectId(senderId), parcel === null || parcel === void 0 ? void 0 : parcel.pickupAddress, note);
    yield parcel.save();
    // Fetch the created parcel with excluded fields
    const cleanParcel = yield parcel_model_1.Parcel.findById(parcel._id)
        .select("-receiver -statusLog._id -deliveryPersonnel")
        .populate("sender", "name email phone _id")
        .populate("receiver", "name email phone -_id")
        .populate("statusLog.updatedBy", "name role -_id");
    return cleanParcel;
});
const deleteParcel = (senderId, parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    // Check if sender owns this parcel
    if (parcel.sender.toString() !== senderId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to delete this parcel");
    }
    // find and delete the parcel
    if (parcel.currentStatus !== parcel_interface_1.ParcelStatus.CANCELLED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Parcel must be cancelled before deletion");
    }
    yield parcel_model_1.Parcel.findByIdAndDelete(parcelId);
});
const getSenderParcels = (senderId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelQuery = new QueryBuilder_1.QueryBuilder(parcel_model_1.Parcel.find({ sender: senderId })
        .select("-receiver -statusLog._id -deliveryPersonnel")
        .populate("sender", "name email phone _id")
        .populate("receiver", "name email phone -_id")
        .populate("statusLog.updatedBy", "name role -_id"), query)
        .search(["trackingId", "deliveryAddress", "pickupAddress"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const parcels = yield parcelQuery.modelQuery;
    const meta = yield parcelQuery.getMeta();
    return {
        data: parcels,
        meta,
    };
});
const getParcelWithTrackingHistory = (parcelId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    // Authorization check
    const isOwner = parcel.sender._id.toString() === userId ||
        parcel.receiver._id.toString() === userId;
    if (!isOwner) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to view this parcel");
    }
    const cleanParcel = yield parcel_model_1.Parcel.findById(parcel._id)
        .select("-type -weight -weightUnit -shippingType -fee -isPaid -couponCode -receiver -statusLog._id")
        .populate("sender", "name email phone -_id")
        .populate("receiver", "name email phone -_id")
        .populate("statusLog.updatedBy", "name role -_id");
    return cleanParcel;
});
// ==================== RECEIVER SERVICES ====================
const getIncomingParcels = (receiverId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelQuery = new QueryBuilder_1.QueryBuilder(parcel_model_1.Parcel.find({
        receiver: receiverId,
        currentStatus: {
            $nin: [
                parcel_interface_1.ParcelStatus.DELIVERED,
                parcel_interface_1.ParcelStatus.PICKED,
                parcel_interface_1.ParcelStatus.FLAGGED,
                parcel_interface_1.ParcelStatus.RETURNED,
                parcel_interface_1.ParcelStatus.BLOCKED,
                parcel_interface_1.ParcelStatus.CANCELLED,
            ],
        },
    })
        .select("-weight -weightUnit -fee -couponCode -isPaid -sender -statusLog._id -statusLog.updatedBy -deliveryPersonnel")
        .populate("sender", "name email phone -_id")
        .populate("receiver", "name email phone _id"), query)
        .search(["trackingId", "deliveryAddress", "pickupAddress"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const parcels = yield parcelQuery.modelQuery;
    const meta = yield parcelQuery.getMeta();
    return {
        data: parcels,
        meta,
    };
});
const confirmDelivery = (parcelId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findOne({ _id: parcelId });
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    if (parcel.receiver.toString() !== receiverId) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to confirm this parcel");
    }
    if (parcel.currentStatus !== parcel_interface_1.ParcelStatus.IN_TRANSIT) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Parcel must be In-Transit to confirm delivery");
    }
    // Update parcel status
    parcel.currentStatus = parcel_interface_1.ParcelStatus.DELIVERED;
    parcel.deliveredAt = new Date();
    parcel.cancelledAt = null;
    addStatusLog(parcel, parcel_interface_1.ParcelStatus.DELIVERED, new mongoose_1.Types.ObjectId(receiverId), parcel === null || parcel === void 0 ? void 0 : parcel.deliveryAddress, "Parcel status updated to delivered by receiver");
    yield parcel.save();
    // Fetch the updated parcel with excluded fields for receiver
    const cleanParcel = yield parcel_model_1.Parcel.findById(parcel._id)
        .select("-_id -weight -weightUnit -fee -couponCode -isPaid -sender -receiver -statusLog._id -statusLog.updatedBy -deliveryPersonnel")
        .populate("sender", "name email phone -_id");
    return cleanParcel;
});
const getDeliveryHistory = (receiverId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelQuery = new QueryBuilder_1.QueryBuilder(parcel_model_1.Parcel.find({
        receiver: receiverId,
        currentStatus: {
            $in: [parcel_interface_1.ParcelStatus.DELIVERED, parcel_interface_1.ParcelStatus.PICKED],
        },
    })
        .select("-weight -weightUnit -fee -couponCode -isPaid -sender -receiver -statusLog._id -statusLog.updatedBy -deliveryPersonnel")
        .populate("sender", "name email phone -_id")
        .populate("receiver", "name email phone"), query)
        .search(["trackingId", "deliveryAddress", "pickupAddress"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const parcels = yield parcelQuery.modelQuery;
    const meta = yield parcelQuery.getMeta();
    return {
        data: parcels,
        meta,
    };
});
// ==================== ADMIN SERVICES ====================
const getAllParcels = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelQuery = new QueryBuilder_1.QueryBuilder(parcel_model_1.Parcel.find(), query)
        .search(["trackingId", "name", "deliveryAddress", "pickupAddress"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const parcels = yield parcelQuery.modelQuery;
    const meta = yield parcelQuery.getMeta();
    return {
        data: parcels,
        meta,
    };
});
const updateParcelStatus = (parcelId, adminId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    if (!payload.currentStatus &&
        !payload.currentLocation &&
        !payload.deliveryPersonnelId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Provide currentStatus, currentLocation or deliveryPersonnelId");
    }
    if (payload.currentStatus &&
        !(0, parcel_utils_1.isValidStatusTransition)(parcel.currentStatus, payload.currentStatus)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Cannot transition from ${parcel.currentStatus} to ${payload.currentStatus}. Valid transitions: ${parcel_utils_1.StatusTransitions[parcel.currentStatus].join(", ")} from ${parcel.currentStatus}`);
    }
    // Update parcel status
    if (payload.currentStatus === parcel_interface_1.ParcelStatus.CANCELLED) {
        parcel.cancelledAt = new Date();
    }
    else {
        parcel.cancelledAt = null;
    }
    if (payload.currentStatus === parcel_interface_1.ParcelStatus.DELIVERED) {
        parcel.deliveredAt = new Date();
    }
    else {
        parcel.deliveredAt = null;
    }
    if (payload.currentStatus === parcel_interface_1.ParcelStatus.BLOCKED) {
        parcel.isBlocked = true;
    }
    if (payload.deliveryPersonnelId) {
        // Check if current status allows delivery personnel assignment
        const validStatusesForPersonnelAssignment = [
            parcel_interface_1.ParcelStatus.APPROVED,
            parcel_interface_1.ParcelStatus.PICKED,
            parcel_interface_1.ParcelStatus.DISPATCHED,
            parcel_interface_1.ParcelStatus.IN_TRANSIT,
            parcel_interface_1.ParcelStatus.RESCHEDULED,
        ];
        const finalStatus = payload.currentStatus || parcel.currentStatus;
        if (!validStatusesForPersonnelAssignment.includes(finalStatus)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Cannot assign delivery personnel when parcel status is ${finalStatus}. Valid statuses: ${validStatusesForPersonnelAssignment.join(", ")}`);
        }
        const deliveryPersonnelId = new mongoose_1.Types.ObjectId(payload.deliveryPersonnelId);
        // Validate delivery personnel exists and has correct role
        const deliveryPersonnel = yield user_model_1.User.findById(deliveryPersonnelId);
        if (!deliveryPersonnel ||
            deliveryPersonnel.role !== user_interface_1.Role.DELIVERY_PERSONNEL) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid delivery personnel ID or not a delivery personnel");
        }
        // Check if personnel is active and available
        if (deliveryPersonnel.isActive !== user_interface_1.IsActive.ACTIVE) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Delivery personnel is ${deliveryPersonnel.isActive} and cannot be assigned`);
        }
        // Add to delivery personnel array if not already present
        if (Array.isArray(parcel.deliveryPersonnel) &&
            !parcel.deliveryPersonnel.includes(deliveryPersonnelId)) {
            parcel.deliveryPersonnel.push(deliveryPersonnelId);
            // Add status log for personnel assignment
            addStatusLog(parcel, finalStatus, new mongoose_1.Types.ObjectId(adminId), payload.currentLocation || "", `Delivery personnel ${deliveryPersonnel.name} assigned`);
        }
    }
    // Update delivery personnel if provided
    if (payload.deliveryPersonnelId) {
        const deliveryPersonnelId = new mongoose_1.Types.ObjectId(payload.deliveryPersonnelId);
        const deliveryPersonnel = yield user_model_1.User.findById(deliveryPersonnelId);
        if (!deliveryPersonnel ||
            deliveryPersonnel.role !== user_interface_1.Role.DELIVERY_PERSONNEL) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid delivery personnel ID or not a delivery personnel");
        }
        if (Array.isArray(parcel.deliveryPersonnel) &&
            !parcel.deliveryPersonnel.includes(deliveryPersonnelId)) {
            parcel.deliveryPersonnel.push(deliveryPersonnelId);
        }
    }
    yield parcel.save();
    return parcel;
});
const blockStatusParcel = (parcelId, adminId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    // check payload status and isBlocked same
    if (parcel.isBlocked === payload.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Parcel is already in this ${payload.isBlocked ? "blocked" : "unblocked"} status`);
    }
    parcel.isBlocked = payload.isBlocked;
    if (payload.isBlocked) {
        parcel.currentStatus = parcel_interface_1.ParcelStatus.BLOCKED;
    }
    else {
        parcel.currentStatus = parcel_interface_1.ParcelStatus.APPROVED;
    }
    addStatusLog(parcel, payload.isBlocked ? parcel_interface_1.ParcelStatus.BLOCKED : parcel_interface_1.ParcelStatus.APPROVED, new mongoose_1.Types.ObjectId(adminId), (parcel === null || parcel === void 0 ? void 0 : parcel.currentLocation) || "", payload.reason || "Parcel blocked by admin.");
    yield parcel.save();
    return parcel;
});
const createParcelByAdmin = (payload, adminId) => __awaiter(void 0, void 0, void 0, function* () {
    const trackingId = (0, generateTrackingId_1.generateTrackingId)();
    const { weight, senderEmail, receiverEmail, pickupAddress, deliveryAddress } = payload, rest = __rest(payload, ["weight", "senderEmail", "receiverEmail", "pickupAddress", "deliveryAddress"]);
    // Sender validation
    const sender = yield user_model_1.User.findOne({ email: senderEmail });
    if (!sender) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Sender account is not found");
    }
    if (!(sender === null || sender === void 0 ? void 0 : sender.phone)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please request sender to update their phone number in their profile.");
    }
    if (sender.role !== user_interface_1.Role.SENDER) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not a sender");
    }
    if (!sender.isVerified) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Sender is not verified");
    }
    if (sender.isActive === user_interface_1.IsActive.BLOCKED ||
        sender.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Sender is ${sender.isActive}.`);
    }
    if (sender.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Sender is deleted.`);
    }
    const senderAddress = pickupAddress || sender.defaultAddress;
    if (!senderAddress) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Pickup address is required or set a default address in your profile.");
    }
    // Receiver validation
    const receiver = yield user_model_1.User.findOne({ email: receiverEmail });
    if (!receiver) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receiver account is not found");
    }
    if (receiver.role !== user_interface_1.Role.RECEIVER) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Provided user is not a receiver");
    }
    if (!receiver.isVerified) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receiver is not verified, you cannot send parcel to this receiver");
    }
    if (receiver.isActive === user_interface_1.IsActive.BLOCKED ||
        receiver.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Receiver is ${receiver.isActive}. You cannot send parcel to this receiver`);
    }
    if (receiver.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Receiver is deleted. You cannot send parcel to this receiver`);
    }
    const receiverAddress = deliveryAddress || receiver.defaultAddress;
    if (!receiverAddress) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Delivery address is required or request receiver to add a default address in their profile.");
    }
    const parcelType = rest.type || parcel_interface_1.ParcelType.PACKAGE;
    const shippingType = rest.shippingType || parcel_interface_1.ShippingType.STANDARD;
    if (rest.couponCode) {
        yield (0, coupon_utils_1.validateCoupon)(rest.couponCode);
    }
    const calcParcelFeeWithoutDiscount = (0, parcel_utils_1.calculateParcelFee)(weight, parcelType, shippingType);
    const finalFee = rest.couponCode
        ? yield (0, coupon_utils_1.applyCoupon)(rest.couponCode, calcParcelFeeWithoutDiscount)
        : calcParcelFeeWithoutDiscount;
    const estimatedDeliveryDate = (0, parcel_utils_1.expectedDeliveryDate)(shippingType);
    const parcel = yield parcel_model_1.Parcel.create(Object.assign({ trackingId, type: parcelType, shippingType,
        weight, sender: sender._id, receiver: receiver._id, fee: finalFee, currentStatus: parcel_interface_1.ParcelStatus.REQUESTED, statusLog: [
            {
                status: parcel_interface_1.ParcelStatus.REQUESTED,
                location: senderAddress,
                note: "Parcel request created by Admin",
                timestamp: new Date(),
                updatedBy: new mongoose_1.Types.ObjectId(adminId),
            },
        ], pickupAddress: senderAddress, deliveryAddress: receiverAddress, estimatedDelivery: estimatedDeliveryDate, couponCode: rest.couponCode }, rest));
    return parcel;
});
const getParcelById = (parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    return parcel;
});
// ==================== PUBLIC SERVICES ====================
const getParcelByTrackingId = (trackingId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findOne({ trackingId }).select("trackingId currentStatus estimatedDelivery statusLog.status statusLog.location statusLog.updatedAt pickupAddress deliveryAddress deliveredAt");
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found with this tracking ID");
    }
    // Return limited public information
    return {
        trackingId: parcel.trackingId,
        currentStatus: parcel.currentStatus,
        estimatedDelivery: parcel.estimatedDelivery,
        deliveredAt: parcel.deliveredAt,
        statusLog: parcel.statusLog,
        pickupAddress: parcel.pickupAddress,
        deliveryAddress: parcel.deliveryAddress,
        createdAt: parcel.createdAt,
    };
});
exports.ParcelService = {
    // Sender Services
    createParcel,
    cancelParcel,
    deleteParcel,
    getSenderParcels,
    // Receiver Services
    getIncomingParcels,
    confirmDelivery,
    getDeliveryHistory,
    // Admin Services
    getAllParcels,
    updateParcelStatus,
    blockStatusParcel,
    createParcelByAdmin,
    getParcelById,
    // Public Services
    getParcelByTrackingId,
    // Shared Services
    getParcelWithTrackingHistory,
};
