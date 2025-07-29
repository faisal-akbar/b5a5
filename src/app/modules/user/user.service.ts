import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../utils/errorHelpers/AppError";
import { IsActive, IUser, Role } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, role, ...rest } = payload;
    if (![Role.SENDER, Role.RECEIVER].includes(role as Role)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid role");
    }

    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }
    
    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

    const user = await User.create({
        email,
        password: hashedPassword,
        role,
        ...rest
    })

    return user
}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    if (decodedToken.role === Role.SENDER || decodedToken.role === Role.RECEIVER) {
        if (userId !== decodedToken.userId) {
            throw new AppError(401, "You are not authorized")
        }
    }

    const ifUserExist = await User.findById(userId);

    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    if (decodedToken.role === Role.ADMIN && ifUserExist.role === Role.SUPER_ADMIN) {
        throw new AppError(401, "You are not authorized")
    }


    if (payload.role) {
        if (decodedToken.role === Role.SENDER || decodedToken.role === Role.RECEIVER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.isActive === IsActive.BLOCKED || payload.isActive === IsActive.INACTIVE || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.SENDER || decodedToken.role === Role.RECEIVER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser
}

const getAllUsers = async () => {
    const users = await User.find({});
    const totalUsers = await User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
};

const getSingleUser = async (id: string) => {
    const user = await User.findById(id).select("-password");
    return {
        data: user
    }
};
const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return {
        data: user
    }
};

const createAdmin = async (payload: Partial<IUser>, decodedToken: JwtPayload) => {
    const { email, password, role, ...rest } = payload;

    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }

    if (decodedToken.role == Role.ADMIN &&  role === Role.SUPER_ADMIN) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to create SUPER_ADMIN");
    }

    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

    const user = await User.create({
        email,
        password: hashedPassword,
        role: Role.ADMIN,
        ...rest
    })

    return user
}

export const UserServices = {
    createUser,
    getAllUsers,
    updateUser,
    getSingleUser,
    getMe,
    createAdmin
}