import { Types } from "mongoose";

export enum Role {
      SUPER_ADMIN = "SUPER_ADMIN",
      ADMIN = "ADMIN",
      RIDER = "RIDER",
      DRIVER = "DRIVER",
};

export enum IsActive {
      ACTIVE = "ACTIVE",
      INACTIVE = "INACTIVE",
      BLOCKED = "BLOCKED"
};

export interface IAuthProvider {
      provider: "google" | "credential";
      providerId: string
};

export interface IUser {
      _id?: Types.ObjectId;
      name: string;
      email: string;
      picture?: string;
      password?: string;
      phone?: string;
      address?: string;
      role: Role;
      auths: IAuthProvider[];
      isVerified?: boolean;
      isDeleted?: boolean;
      isActive?: IsActive
};