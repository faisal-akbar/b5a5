"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_routes_1 = require("../modules/auth/auth.routes");
const coupon_routes_1 = require("../modules/coupon/coupon.routes");
const otp_routes_1 = require("../modules/otp/otp.routes");
const parcel_routes_1 = require("../modules/parcel/parcel.routes");
const user_routes_1 = require("../modules/user/user.routes");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/otp",
        route: otp_routes_1.OtpRoutes,
    },
    {
        path: "/parcels",
        route: parcel_routes_1.ParcelRoutes,
    },
    {
        path: "/coupon",
        route: coupon_routes_1.CouponRoutes,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
