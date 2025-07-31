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
exports.CouponService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../utils/errorHelpers/AppError"));
const coupon_model_1 = require("./coupon.model");
const coupon_interface_1 = require("./coupon.interface");
const coupon_utils_1 = require("./coupon.utils");
const createCoupon = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { discountType, discountValue, expiresAt } = payload, rest = __rest(payload, ["discountType", "discountValue", "expiresAt"]);
    const generateCode = (0, coupon_utils_1.generateCouponCode)();
    // Validate discount value based on discount type
    if (discountType === coupon_interface_1.DiscountType.PERCENTAGE && (discountValue < 0 || discountValue > 100)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Percentage discount value must be between 0 and 100");
    }
    if (discountType === coupon_interface_1.DiscountType.FIXED && discountValue < 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Fixed discount value must be a positive number");
    }
    // Validate expiration date
    if (expiresAt && new Date(expiresAt) <= new Date()) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Expiration date must be in the future");
    }
    const coupon = yield coupon_model_1.Coupon.create(Object.assign({ code: generateCode, discountType,
        discountValue,
        expiresAt }, rest));
    return coupon;
});
exports.CouponService = {
    createCoupon: createCoupon,
    // Other coupon related services can be added here
};
