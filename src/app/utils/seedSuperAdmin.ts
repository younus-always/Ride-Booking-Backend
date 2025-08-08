import { User } from "../modules/user/user.model";
import { envVars } from "../config/env";
import AppError from "../errorHelper/AppError";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";

export const seedSuperAdmin = async () => {
      try {
            const isSuperAdminExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL })
            if (isSuperAdminExist) {
                  throw new AppError(httpStatus.BAD_REQUEST, "Super admin already exist!")
            };
            console.log("Trying to create Super Admin.")

            const hashPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND))

            const authProvider: IAuthProvider = {
                  provider: "creadentials",
                  providerId: envVars.SUPER_ADMIN_EMAIL
            };
            const payload: IUser = {
                  name: "Super Admin",
                  email: envVars.SUPER_ADMIN_EMAIL,
                  password: hashPassword,
                  role: Role.SUPER_ADMIN,
                  isVerified: true,
                  auths: [authProvider]
            };
            const superAdmin = await User.create(payload)
            console.log(superAdmin)
            console.log("Super admin created successfully.")
      } catch (error) {
            console.log(error)
      }
};