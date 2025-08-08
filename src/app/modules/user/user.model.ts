import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>({
      provider: { type: String, required: true },
      providerId: { type: String, required: true }
}, {
      _id: false
});

const userSchema = new Schema<IUser>({
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, unique: true, trim: true },
      picture: { type: String },
      password: { type: String },
      role: {
            type: String,
            enum: Object.values(Role),
            default: Role.USER
      },
      isVerified: { type: Boolean, default: false },
      isDeleted: { type: Boolean, default: false },
      isActive: {
            type: String,
            enum: Object.values(IsActive),
            default: IsActive.ACTIVE
      },
      auths: [authProviderSchema]
}, {
      versionKey: false,
      timestamps: true
});

export const User = model<IUser>("User", userSchema);