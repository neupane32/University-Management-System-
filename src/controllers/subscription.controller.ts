import webTokenUtils from "../utils/webToken.utils";
import StudentService from "../services/student.service";
import { StatusCodes } from "../constant/StatusCode";
import { Request, Response } from "express";
import SubscriptionService from "../services/subscription.service";


const subscriptionService = new SubscriptionService();

export class SubscriptionController {
  async addSunscription(req: Request, res: Response) {
    try {
      const data = await subscriptionService.addSubscription(req.body);
     
      res.status(StatusCodes.SUCCESS).json({
              data: {
               data,
                message: "subscription added successfully",
              },
            });
    } catch (error) {
        if (error instanceof Error) {
          res.status(StatusCodes.BAD_REQUEST).json({
            message: error.message,
          });
        } else {
          res.status(StatusCodes.BAD_REQUEST).json({
            message: "error while logging in",
          });
        }
      }
  }
  async getSubscription(req: Request, res: Response) {
    try {
      const data = await subscriptionService.getSubscription()
     
      res.status(StatusCodes.SUCCESS).json({
              data: {
               data,
                message: "subscription fetched successfully",
              },
            });
    } catch (error) {
        if (error instanceof Error) {
          res.status(StatusCodes.BAD_REQUEST).json({
            message: error.message,
          });
        } else {
          res.status(StatusCodes.BAD_REQUEST).json({
            message: "error while logging in",
          });
        }
      }
  }



}
