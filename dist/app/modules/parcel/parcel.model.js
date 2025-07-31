"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = require("mongoose");
const parcel_interface_1 = require("./parcel.interface");
const statusLogSchema = new mongoose_1.Schema({
    status: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelStatus),
        required: true,
    },
    location: {
        type: String,
        max: 200,
    },
    note: {
        type: String,
        max: 500,
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    _id: false,
    timestamps: true,
    versionKey: false,
});
const parcelSchema = new mongoose_1.Schema({
    trackingId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    type: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelType),
        default: parcel_interface_1.ParcelType.PACKAGE,
    },
    shippingType: {
        type: String,
        enum: Object.values(parcel_interface_1.ShippingType),
        default: parcel_interface_1.ShippingType.STANDARD,
    },
    weight: {
        type: Number,
        min: 0.1,
        max: 10,
    },
    weightUnit: {
        type: String,
        default: "kg",
    },
    fee: {
        type: Number,
        min: 120, // 120 BDT / kg
        default: 120,
        required: true,
    },
    couponCode: {
        type: String,
        max: 20,
        default: null,
    },
    estimatedDelivery: {
        type: Date,
        default: null,
    },
    currentStatus: {
        type: String,
        enum: Object.values(parcel_interface_1.ParcelStatus),
        default: parcel_interface_1.ParcelStatus.REQUESTED,
        required: true,
    },
    currentLocation: {
        type: String,
        max: 200,
        default: null,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    receiver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    pickupAddress: {
        type: String,
        required: true,
        minlength: 5,
        max: 500,
    },
    deliveryAddress: {
        type: String,
        required: true,
        min: 5,
        max: 500,
    },
    statusLog: {
        type: [statusLogSchema],
        default: [],
    },
    deliveryPersonnel: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },
    deliveredAt: {
        type: Date,
        default: null,
    },
    cancelledAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Parcel = (0, mongoose_1.model)("Parcel", parcelSchema);
