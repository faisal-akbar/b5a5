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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const parcel_model_1 = require("../parcel/parcel.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const fourteenDaysAgo = new Date(now).setDate(now.getDate() - 14);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const getUserStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsersPromise = user_model_1.User.countDocuments();
    const totalActiveUsersPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.IsActive.ACTIVE,
    });
    const totalInActiveUsersPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.IsActive.INACTIVE,
    });
    const totalBlockedUsersPromise = user_model_1.User.countDocuments({
        isActive: user_interface_1.IsActive.BLOCKED,
    });
    const newUsersInLast7DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const newUsersInLast30DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const usersByRolePromise = user_model_1.User.aggregate([
        //stage -1 : Grouping users by role and count total users in each role
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 },
            },
        },
    ]);
    const [totalUsers, totalActiveUsers, totalInActiveUsers, totalBlockedUsers, newUsersInLast7Days, newUsersInLast30Days, usersByRole,] = yield Promise.all([
        totalUsersPromise,
        totalActiveUsersPromise,
        totalInActiveUsersPromise,
        totalBlockedUsersPromise,
        newUsersInLast7DaysPromise,
        newUsersInLast30DaysPromise,
        usersByRolePromise,
    ]);
    return {
        totalUsers,
        totalActiveUsers,
        totalInActiveUsers,
        totalBlockedUsers,
        newUsersInLast7Days,
        newUsersInLast30Days,
        usersByRole,
    };
});
const getParcelsStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalParcelPromise = parcel_model_1.Parcel.countDocuments();
    const totalParcelByStatusPromise = parcel_model_1.Parcel.aggregate([
        //stage-1 group stage
        {
            $group: {
                _id: "$currentStatus",
                count: { $sum: 1 },
            },
        },
    ]);
    const parcelPerTypePromise = parcel_model_1.Parcel.aggregate([
        //stage-1 group stage
        {
            $group: {
                _id: "$type",
                count: { $sum: 1 },
            },
        },
    ]);
    const parcelPerShippingTypePromise = parcel_model_1.Parcel.aggregate([
        //stage-1 group stage
        {
            $group: {
                _id: "$shippingType",
                count: { $sum: 1 },
            },
        },
    ]);
    const avgFeePerParcelPromise = parcel_model_1.Parcel.aggregate([
        // stage 1  - group stage
        {
            $group: {
                _id: null,
                avgFee: { $avg: "$fee" },
            },
        },
    ]);
    const parcelCreatedInLast7DaysPromise = parcel_model_1.Parcel.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const parcelCreatedInLast14DaysPromise = parcel_model_1.Parcel.countDocuments({
        createdAt: { $gte: fourteenDaysAgo },
    });
    const parcelCreatedInLast30DaysPromise = parcel_model_1.Parcel.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const totalParcelCreatedByUniqueSenderPromise = parcel_model_1.Parcel.distinct("sender").then((user) => user.length);
    const totalParcelReceiverByUniqueReceiverPromise = parcel_model_1.Parcel.distinct("receiver").then((user) => user.length);
    const [totalParcel, totalParcelByStatus, parcelPerType, parcelPerShippingType, avgFeePerParcel, parcelCreatedInLast7Days, parcelCreatedInLast14Days, parcelCreatedInLast30Days, totalParcelCreatedByUniqueSender, totalParcelReceiverByUniqueReceiver,] = yield Promise.all([
        totalParcelPromise,
        totalParcelByStatusPromise,
        parcelPerTypePromise,
        parcelPerShippingTypePromise,
        avgFeePerParcelPromise,
        parcelCreatedInLast7DaysPromise,
        parcelCreatedInLast14DaysPromise,
        parcelCreatedInLast30DaysPromise,
        totalParcelCreatedByUniqueSenderPromise,
        totalParcelReceiverByUniqueReceiverPromise,
    ]);
    return {
        totalParcel,
        totalParcelByStatus,
        parcelPerType,
        parcelPerShippingType,
        avgFeePerParcel,
        parcelCreatedInLast7Days,
        parcelCreatedInLast14Days,
        parcelCreatedInLast30Days,
        totalParcelCreatedByUniqueSender,
        totalParcelReceiverByUniqueReceiver,
    };
});
exports.StatsService = {
    getParcelsStats,
    getUserStats,
};
