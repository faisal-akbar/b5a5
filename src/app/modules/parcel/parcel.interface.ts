import { Types } from "mongoose";

export enum ParcelStatus {
  REQUESTED = "Requested",
  APPROVED = "Approved",
  DISPATCHED = "Dispatched",
  IN_TRANSIT = "In-Transit",
  DELIVERED = "Delivered",
  RESCHEDULED = "Rescheduled",
  CANCELLED = "Cancelled",
  BLOCKED = "Blocked",
  RETURNED = "Returned",
  PICKED = "Picked",
  FLAGGED = "Flagged",
}

export enum ParcelType {
  DOCUMENT = "document",
  PACKAGE = "package",
  FRAGILE = "fragile",
  ELECTRONICS = "electronics",
}

export enum ShippingType {
  STANDARD = "standard",
  EXPRESS = "express",
  SAME_DAY = "same_day",
  OVERNIGHT = "overnight",
}

export interface IStatusLog {
  status: ParcelStatus;
  location?: string;
  note?: string;
  updatedBy?: Types.ObjectId;
  updatedAt?: Date;
}

export interface IParcel {
  trackingId: string;
  type?: ParcelType;
  shippingType?: ShippingType;
  weight?: number;
  weightUnit?: string;
  fee?: number;
  couponCode?: string | null;
  estimatedDelivery?: Date | null; // estimated delivery date
  currentStatus: ParcelStatus;
  currentLocation?: string | null;
  isPaid?: boolean;
  isBlocked?: boolean;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  pickupAddress?: string;
  deliveryAddress?: string;
  deliveryPersonnel?: Types.ObjectId[];
  statusLog?: IStatusLog[];
  deliveredAt?: Date | null; // actual delivery date
  cancelledAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateParcel {
  type?: ParcelType;
  shippingType?: ShippingType;
  weight: number;
  couponCode?: string;
  senderEmail?: boolean;
  receiverEmail: string;
  pickupAddress?: string;
  deliveryAddress?: string;
}
