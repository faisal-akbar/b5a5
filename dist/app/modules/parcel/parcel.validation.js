"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlockedStatusSchema = exports.updateStatusPersonnelSchema = exports.updateParcelSchemaAdmin = exports.createParcelByAdminZodSchema = exports.createParcelZodSchema = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
const parcel_interface_1 = require("./parcel.interface");
// For sender
exports.createParcelZodSchema = zod_1.z.object({
    type: zod_1.z.enum(Object.values(parcel_interface_1.ParcelType)).optional(),
    shippingType: zod_1.z.enum(Object.values(parcel_interface_1.ShippingType)).optional(),
    weight: zod_1.z
        .number({ invalid_type_error: "Weight must be a number" })
        .min(0.1, { message: "Weight must be at least 0.1 kg" })
        .max(10, { message: "Weight cannot exceed 10 kg" }),
    couponCode: zod_1.z
        .string({ invalid_type_error: "Coupon code must be a string" })
        .max(20, { message: "Coupon code cannot exceed 20 characters" })
        .optional(),
    receiverEmail: zod_1.z
        .string({ invalid_type_error: "Email must be string" })
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }),
    pickupAddress: zod_1.z
        .string({ invalid_type_error: "Pickup address must be string" })
        .min(5, { message: "Pickup address must be at least 5 characters long." })
        .max(100, { message: "Pickup address cannot exceed 100 characters." })
        .optional(),
    deliveryAddress: zod_1.z
        .string({ invalid_type_error: "Delivery address must be string" })
        .min(5, { message: "Delivery address must be at least 5 characters long." })
        .max(100, { message: "Delivery address cannot exceed 100 characters." })
        .optional(),
});
// For admin
exports.createParcelByAdminZodSchema = exports.createParcelZodSchema.extend({
    senderEmail: zod_1.z
        .string({ invalid_type_error: "Email must be string" })
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }),
});
// StatusLog schema
const StatusLogSchema = zod_1.z.object({
    status: zod_1.z.enum(Object.values(parcel_interface_1.ParcelStatus)),
    location: zod_1.z.string().max(200).optional(),
    note: zod_1.z.string().max(500).optional(),
    updatedBy: zod_1.z
        .string()
        .refine((val) => mongoose_1.Types.ObjectId.isValid(val), "Invalid user id")
        .optional(),
});
// Admin Update Parcel
exports.updateParcelSchemaAdmin = zod_1.z.object({
    trackingId: zod_1.z.string().optional(),
    type: zod_1.z.enum(Object.values(parcel_interface_1.ParcelType)).optional(),
    shippingType: zod_1.z.enum(Object.values(parcel_interface_1.ShippingType)).optional(),
    weight: zod_1.z.number().optional(),
    weightUnit: zod_1.z.string().optional(),
    fee: zod_1.z.number().optional(),
    couponCode: zod_1.z.string().nullable().optional(),
    estimatedDelivery: zod_1.z.date().nullable().optional(),
    currentStatus: zod_1.z.enum(Object.values(parcel_interface_1.ParcelStatus)).optional(),
    currentLocation: zod_1.z.string().nullable().optional(),
    isPaid: zod_1.z.boolean().optional(),
    isBlocked: zod_1.z.boolean().optional(),
    sender: zod_1.z
        .string()
        .refine((val) => mongoose_1.Types.ObjectId.isValid(val), "Invalid sender id")
        .optional(),
    receiver: zod_1.z
        .string()
        .refine((val) => mongoose_1.Types.ObjectId.isValid(val), "Invalid receiver id")
        .optional(),
    pickupAddress: zod_1.z.string().optional(),
    deliveryAddress: zod_1.z.string().optional(),
    deliveryPersonnel: zod_1.z
        .array(zod_1.z
        .string()
        .refine((val) => mongoose_1.Types.ObjectId.isValid(val), "Invalid personnel id"))
        .optional(),
    statusLog: zod_1.z.array(StatusLogSchema).optional(),
    deliveredAt: zod_1.z.date().nullable().optional(),
    cancelledAt: zod_1.z.date().nullable().optional(),
});
exports.updateStatusPersonnelSchema = zod_1.z.object({
    currentStatus: zod_1.z.enum(Object.values(parcel_interface_1.ParcelStatus)).optional(),
    currentLocation: zod_1.z.string().nullable().optional(),
    deliveryPersonnelId: zod_1.z
        .string()
        .refine((val) => mongoose_1.Types.ObjectId.isValid(val), "Invalid personnel id")
        .optional(),
});
exports.updateBlockedStatusSchema = zod_1.z.object({
    isBlocked: zod_1.z.boolean({
        invalid_type_error: "isBlocked must be true or false",
    }),
    reason: zod_1.z.string().optional(),
});
