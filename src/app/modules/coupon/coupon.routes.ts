import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCouponZodSchema } from './coupon.validation';
import { Role } from "../user/user.interface";
import { CouponController } from "./coupon.controller";

const router = Router()

router.post("/", 
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN), 
    validateRequest(createCouponZodSchema), 
    CouponController.createCoupon)


export const CouponRoutes = router;