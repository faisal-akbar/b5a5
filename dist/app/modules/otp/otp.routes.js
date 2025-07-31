"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRoutes = void 0;
const express_1 = __importDefault(require("express"));
const otp_controller_1 = require("./otp.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const otp_validation_1 = require("./otp.validation");
const router = express_1.default.Router();
router.post("/send", (0, validateRequest_1.validateRequest)(otp_validation_1.otpSendZodSchema), otp_controller_1.OTPController.sendOTP);
router.post("/verify", (0, validateRequest_1.validateRequest)(otp_validation_1.otpVerifyZodSchema), otp_controller_1.OTPController.verifyOTP);
exports.OtpRoutes = router;
