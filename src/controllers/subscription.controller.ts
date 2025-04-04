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
      console.log("🚀 ~ SubscriptionController ~ addSunscription ~ data:", data)
     
      res.status(StatusCodes.SUCCESS).json({
              data: {
               data,
                message: "subscription added successfully",
              },
            });
    } catch (error) {
        console.log("🚀 ~ SubscriptionController ~ addSunscription ~ error:", error)
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
    console.log('xiro??')
    try {
      const data = await subscriptionService.getSubscription()
     
      res.status(StatusCodes.SUCCESS).json({
              data: {
               data,
                message: "subscription fetched successfully",
              },
            });
    } catch (error) {
        console.log("🚀 ~ SubscriptionController ~ getSubscription ~ error:", error)
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
  async addUniSubscription(req: Request, res: Response) {
    console.log('xiro??')
    try {
      const data=req.body
      const uni_id=req.user.id
      console.log("🚀 ~ SubscriptionController ~ addUniSubscription ~ data:", data)
      const saved = await subscriptionService.addUniSubscription(data,uni_id)
     
      res.status(StatusCodes.SUCCESS).json({
              data: {
               data,
                message: "subscription fetched successfully",
              },
            });

    } catch (error) {
        console.log("🚀 ~ SubscriptionController ~ getSubscription ~ error:", error)
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
