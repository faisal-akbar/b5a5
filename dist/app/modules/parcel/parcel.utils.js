"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllParcelStatuses = exports.isValidStatusTransition = exports.StatusTransitions = exports.expectedDeliveryDate = exports.calculateParcelFee = void 0;
const parcel_interface_1 = require("./parcel.interface");
const calculateParcelFee = (weight, type, shippingType) => {
    let baseFee = 50;
    // Weight-based calculation
    if (weight <= 0.5) {
        baseFee += 50; // Up to 500g
    }
    else if (weight <= 1) {
        baseFee += 100; // 500g to 1kg
    }
    else if (weight <= 2) {
        baseFee += 150; // 1kg to 2kg
    }
    else if (weight <= 5) {
        baseFee += 250; // 2kg to 5kg
    }
    else if (weight <= 10) {
        baseFee += 400; // 5kg to 10kg
    }
    else {
        throw new Error("Weight exceeds maximum limit of 10kg");
    }
    // Type-based surcharge
    const typeSurcharge = {
        [parcel_interface_1.ParcelType.FRAGILE]: 25,
        [parcel_interface_1.ParcelType.ELECTRONICS]: 40,
        [parcel_interface_1.ParcelType.DOCUMENT]: 0,
        [parcel_interface_1.ParcelType.PACKAGE]: 10,
    };
    baseFee += type ? typeSurcharge[type] || 0 : 0;
    // Shipping type-based surcharge
    const shippingSurcharge = {
        [parcel_interface_1.ShippingType.STANDARD]: 0,
        [parcel_interface_1.ShippingType.EXPRESS]: 50,
        [parcel_interface_1.ShippingType.SAME_DAY]: 100,
        [parcel_interface_1.ShippingType.OVERNIGHT]: 75,
    };
    baseFee += shippingType
        ? shippingSurcharge[shippingType] || 0
        : 0;
    return Math.round(baseFee);
};
exports.calculateParcelFee = calculateParcelFee;
const expectedDeliveryDate = (shippingType) => {
    const today = new Date();
    const estimatedDelivery = new Date(today);
    switch (shippingType) {
        case parcel_interface_1.ShippingType.STANDARD:
            estimatedDelivery.setDate(today.getDate() + 5); // 5 days for standard
            break;
        case parcel_interface_1.ShippingType.EXPRESS:
            estimatedDelivery.setDate(today.getDate() + 2); // 2 days for express
            break;
        case parcel_interface_1.ShippingType.SAME_DAY:
            estimatedDelivery.setHours(today.getHours() + 6); // 6 hours for same day
            break;
        case parcel_interface_1.ShippingType.OVERNIGHT:
            estimatedDelivery.setDate(today.getDate() + 1); // 1 day for overnight
            break;
        default:
            throw new Error("Invalid shipping type");
    }
    return estimatedDelivery;
};
exports.expectedDeliveryDate = expectedDeliveryDate;
// Status transition validation
exports.StatusTransitions = {
    [parcel_interface_1.ParcelStatus.REQUESTED]: [parcel_interface_1.ParcelStatus.APPROVED, parcel_interface_1.ParcelStatus.CANCELLED],
    [parcel_interface_1.ParcelStatus.APPROVED]: [
        parcel_interface_1.ParcelStatus.PICKED,
        parcel_interface_1.ParcelStatus.CANCELLED,
        parcel_interface_1.ParcelStatus.FLAGGED,
    ],
    [parcel_interface_1.ParcelStatus.PICKED]: [
        parcel_interface_1.ParcelStatus.DISPATCHED,
        parcel_interface_1.ParcelStatus.RETURNED,
        parcel_interface_1.ParcelStatus.FLAGGED,
    ],
    [parcel_interface_1.ParcelStatus.DISPATCHED]: [
        parcel_interface_1.ParcelStatus.IN_TRANSIT,
        parcel_interface_1.ParcelStatus.RETURNED,
        parcel_interface_1.ParcelStatus.FLAGGED,
    ],
    [parcel_interface_1.ParcelStatus.IN_TRANSIT]: [
        parcel_interface_1.ParcelStatus.DELIVERED,
        parcel_interface_1.ParcelStatus.RETURNED,
        parcel_interface_1.ParcelStatus.RESCHEDULED,
        parcel_interface_1.ParcelStatus.FLAGGED,
    ],
    [parcel_interface_1.ParcelStatus.RESCHEDULED]: [
        parcel_interface_1.ParcelStatus.IN_TRANSIT,
        parcel_interface_1.ParcelStatus.DELIVERED,
        parcel_interface_1.ParcelStatus.CANCELLED,
    ],
    [parcel_interface_1.ParcelStatus.DELIVERED]: [],
    [parcel_interface_1.ParcelStatus.CANCELLED]: [parcel_interface_1.ParcelStatus.REQUESTED], // Can be reopened
    [parcel_interface_1.ParcelStatus.RETURNED]: [parcel_interface_1.ParcelStatus.APPROVED],
    [parcel_interface_1.ParcelStatus.FLAGGED]: [parcel_interface_1.ParcelStatus.BLOCKED, parcel_interface_1.ParcelStatus.CANCELLED],
    [parcel_interface_1.ParcelStatus.BLOCKED]: [parcel_interface_1.ParcelStatus.APPROVED, parcel_interface_1.ParcelStatus.CANCELLED],
};
// Helper function to validate status transitions
const isValidStatusTransition = (currentStatus, newStatus) => {
    return exports.StatusTransitions[currentStatus].includes(newStatus);
};
exports.isValidStatusTransition = isValidStatusTransition;
// Helper function to get all status values
const getAllParcelStatuses = () => {
    return Object.values(parcel_interface_1.ParcelStatus);
};
exports.getAllParcelStatuses = getAllParcelStatuses;
