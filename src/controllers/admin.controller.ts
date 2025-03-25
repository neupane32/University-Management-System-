import { Request, Response } from "express";
import adminService from "../services/admin.service";
import { AdminInterface } from "../interface/admin.interface";
import { StatusCodes } from "../constant/StatusCode";
import webTokenUtils from "../utils/webToken.utils";
import { tokenToString } from "typescript";

export class AdminController {


  async loginAdmin(req: Request, res: Response) {
    try {
      const data = await adminService.loginAdmin(req.body);
      const token = webTokenUtils.generateTokens(
        {
          id: data.id,
        },
        data.role
      );
      console.log("🚀 ~ AdminController ~ loginAdmin ~ token:", token);
      res.status(StatusCodes.SUCCESS).json({
        data: {
          id: data.id,
          email: data.email,
          tokens: {
            accessToken: token.accessToken,
          },
          message: "Admin LoginSuccessfully",
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error.message,
        });
      }
    }
  }
}
