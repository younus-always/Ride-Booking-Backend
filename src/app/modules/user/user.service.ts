import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelper/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";


const createUser = async (payload: Partial<IUser>) => {
      const { email, password, ...rest } = payload;
      const isUserExist = await User.findOne({ email });

      if (isUserExist) {
            throw new AppError(httpStatus.CONFLICT, "User already exists.");
      }
      const hashPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

      const authProvider: IAuthProvider = {
            provider: "creadentials",
            providerId: email as string
      };

      const user = await User.create({
            email,
            password: hashPassword,
            auths: [authProvider],
            ...rest
      });
      return user;
};

const getAllUsers = async () => {
      const users = await User.find();
      const total = await User.countDocuments();
      return {
            data: users,
            meta: {
                  total
            }
      };
};

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
      const isUserExist = await User.findById(userId);
      const restrictedRoles = [Role.USER, Role.RIDER, Role.DRIVER];

      if (!isUserExist) {
            throw new AppError(httpStatus.NOT_FOUND, "User not found.");
      }

      if (payload.role) {
            if (restrictedRoles.includes(decodedToken.role)) {
                  throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to change roles.");
            }
            if (decodedToken.role === Role.ADMIN && payload.role === Role.SUPER_ADMIN) {
                  throw new AppError(httpStatus.FORBIDDEN, "Admins cannot assign SUPER_ADMIN role.");
            }
      };

      if (payload.isActive || payload.isDeleted || payload.isVerified) {
            if (restrictedRoles.includes(decodedToken.role)) {
                  throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to change user status flags.");
            }
      };

      if (payload.password) {
            payload.password = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND));
      };

      const updatedUser = await User.findByIdAndUpdate(userId, payload, {
            new: true,
            runValidators: true
      });
      return updatedUser;
};



export const UserService = {
      createUser,
      getAllUsers,
      updateUser
};