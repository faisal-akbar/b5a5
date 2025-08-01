"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingType = exports.ParcelType = exports.ParcelStatus = void 0;
var ParcelStatus;
(function (ParcelStatus) {
    ParcelStatus["REQUESTED"] = "Requested";
    ParcelStatus["APPROVED"] = "Approved";
    ParcelStatus["PICKED"] = "Picked";
    ParcelStatus["DISPATCHED"] = "Dispatched";
    ParcelStatus["IN_TRANSIT"] = "In-Transit";
    ParcelStatus["RESCHEDULED"] = "Rescheduled";
    ParcelStatus["DELIVERED"] = "Delivered";
    ParcelStatus["RETURNED"] = "Returned";
    ParcelStatus["CANCELLED"] = "Cancelled";
    ParcelStatus["BLOCKED"] = "Blocked";
    ParcelStatus["FLAGGED"] = "Flagged";
})(ParcelStatus || (exports.ParcelStatus = ParcelStatus = {}));
var ParcelType;
(function (ParcelType) {
    ParcelType["DOCUMENT"] = "document";
    ParcelType["PACKAGE"] = "package";
    ParcelType["FRAGILE"] = "fragile";
    ParcelType["ELECTRONICS"] = "electronics";
})(ParcelType || (exports.ParcelType = ParcelType = {}));
var ShippingType;
(function (ShippingType) {
    ShippingType["STANDARD"] = "standard";
    ShippingType["EXPRESS"] = "express";
    ShippingType["SAME_DAY"] = "same_day";
    ShippingType["OVERNIGHT"] = "overnight";
})(ShippingType || (exports.ShippingType = ShippingType = {}));
