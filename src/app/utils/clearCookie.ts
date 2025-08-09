import { Response } from "express";

export const clearAuthCookie = (res: Response, cookieName: string) => {
      res.clearCookie(cookieName, {
            httpOnly: true,
            secure: false
      });
};