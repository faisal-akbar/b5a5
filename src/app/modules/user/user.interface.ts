import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  SENDER = "SENDER",
  RECEIVER = "RECEIVER",
  DELIVERY_PERSONNEL = "DELIVERY_PERSONNEL",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  defaultAddress?: string;
  phone?: string;
  picture?: string;
  role: Role;
  isVerified?: boolean;
  isActive?: IsActive;
  isDeleted?: boolean;
    
}
