import { Request, Response } from "express";
import adminService from "../services/admin.service";
import { AdminInterface } from "../interface/admin.interface";
import { StatusCodes } from "../constant/StatusCode";
import webTokenUtils from "../utils/webToken.utils";
import { tokenToString } from "typescript";

export class AdminController {


  async loginAdmin(req: Request, res: Response) {
    try {
      console.log('object')
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

  async getAllUniversity(req: Request, res: Response) {
    try {
      const data = await adminService.getAllUniversity(req.body as AdminInterface);
      res.status(StatusCodes.SUCCESS).json({
        data,
        message: "Universities fetched successfully",
      });
    } catch (error) {
      console.error("🚀 ~ AdminController ~ getAllUniversity ~ error:", error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: error instanceof Error ? error.message : "Error while fetching universities",
      });
    }
  }

  async getCompareUniversitySubscription(req: Request, res: Response) {
    try {
      const data = await adminService.getCompareUniversitySubscription(req.body as AdminInterface);
      res.status(StatusCodes.SUCCESS).json({
        data,
        message: "Subscription comparison fetched successfully",
      });
    } catch (error) {
      console.error("🚀 ~ AdminController ~ getCompareUniversitySubscription ~ error:", error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: error instanceof Error ? error.message : "Error while fetching subscription comparison",
      });
    }
  }

}
