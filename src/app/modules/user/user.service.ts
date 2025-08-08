import { envVars } from "../../config/env";
import AppError from "../../errorHelper/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import httpStatus from 'http-status-codes';


const createUser = async (payload: Partial<IUser>) => {
      const { email, password, ...rest } = payload
      const isUserExist = await User.findOne({ email })

      if (isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
      }
      const hashPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

      const authProvider: IAuthProvider = {
            provider: "creadentials",
            providerId: email as string
      };

      const user = await User.create({
            email,
            password: hashPassword,
            auths: [authProvider],
            ...rest
      })
      return user
};

const getAllUsers = async () => {
      const users = await User.find()
      const total = await User.countDocuments()
      return {
            data: users,
            meta: {
                  total
            }
      }
};

const updateUser = async (id: string, payload: Partial<IUser>) => {

};



export const UserService = {
      createUser,
      getAllUsers,
      updateUser
};