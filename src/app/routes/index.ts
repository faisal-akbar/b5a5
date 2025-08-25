import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { CouponRoutes } from "../modules/coupon/coupon.routes";
import { OtpRoutes } from "../modules/otp/otp.routes";
import { ParcelRoutes } from "../modules/parcel/parcel.routes";
import { StatsRoutes } from "../modules/stats/stats.routes";
import { UserRoutes } from "../modules/user/user.routes";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/otp",
    route: OtpRoutes,
  },
  {
    path: "/parcels",
    route: ParcelRoutes,
  },
  {
    path: "/stats",
    route: StatsRoutes,
  },
  {
    path: "/coupon",
    route: CouponRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
