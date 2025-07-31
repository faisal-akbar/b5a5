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
exports.generateCouponCode = generateCouponCode;
exports.validateCoupon = validateCoupon;
exports.applyCoupon = applyCoupon;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../utils/errorHelpers/AppError"));
const coupon_model_1 = require("./coupon.model");
const coupon_interface_1 = require("./coupon.interface");
function generateCouponCode(length = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let coupon = '';
    for (let i = 0; i < length; i++) {
        coupon += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return coupon.toUpperCase();
}
function validateCoupon(code) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const coupon = yield coupon_model_1.Coupon.findOne({ code: code });
        if (!coupon) {
            return { valid: false, message: 'Invalid coupon code' };
        }
        if (!coupon.isActive) {
            return { valid: false, message: 'Coupon is not active' };
        }
        if (coupon.expiresAt && coupon.expiresAt < new Date()) {
            return { valid: false, message: 'Coupon has expired' };
        }
        if ((coupon === null || coupon === void 0 ? void 0 : coupon.usageLimit) && ((_a = coupon === null || coupon === void 0 ? void 0 : coupon.usedCount) !== null && _a !== void 0 ? _a : 0) >= (coupon === null || coupon === void 0 ? void 0 : coupon.usageLimit)) {
            return { valid: false, message: 'Coupon has reached its usage limit' };
        }
        return { valid: true, coupon: coupon };
    });
}
function applyCoupon(couponCode, fee) {
    return __awaiter(this, void 0, void 0, function* () {
        const { valid, coupon, message } = yield validateCoupon(couponCode);
        if (!valid) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, message || 'Invalid coupon code');
        }
        if ((coupon === null || coupon === void 0 ? void 0 : coupon.discountType) === coupon_interface_1.DiscountType.PERCENTAGE) {
            fee -= fee * (coupon.discountValue / 100);
        }
        else if ((coupon === null || coupon === void 0 ? void 0 : coupon.discountType) === coupon_interface_1.DiscountType.FIXED) {
            fee -= coupon.discountValue;
        }
        // Update coupon usage
        if (coupon && typeof coupon.usedCount === 'number') {
            coupon.usedCount++;
            yield coupon.save();
        }
        // Ensure fee does not go below a minimum threshold
        const MINIMUM_FEE = 50;
        if (fee < MINIMUM_FEE) {
            fee = MINIMUM_FEE;
        }
        return fee;
    });
}
