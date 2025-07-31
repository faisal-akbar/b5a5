"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coupon = void 0;
const mongoose_1 = require("mongoose");
const coupon_interface_1 = require("./coupon.interface");
const couponSchema = new mongoose_1.Schema({
    code: { type: String, required: true, unique: true },
    discountType: { type: String, enum: Object.values(coupon_interface_1.DiscountType), default: coupon_interface_1.DiscountType.PERCENTAGE, required: true },
    discountValue: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number, min: 0, default: 50 },
    usedCount: { type: Number, min: 0, default: 0 },
}, {
    timestamps: true,
    versionKey: false
});
exports.Coupon = (0, mongoose_1.model)('Coupon', couponSchema);
