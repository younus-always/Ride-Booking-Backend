import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";


const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.createUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User created successfully",
    data: user
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All User Retrived Successfully",
    data: result.data,
    meta: result.meta
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  // const token = req.headers.authorization;
  // const verifiedToken = jwt.verify(token as string, envVars.JWT_SECRET_TOKEN) as JwtPayload;
  const verifiedToken = req.user;
  const user = await UserService.updateUser(id, payload, verifiedToken);

  console.log(verifiedToken);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully",
    data: user
  });
});

export const UserController = {
  createUser,
  getAllUsers,
  updateUser
};