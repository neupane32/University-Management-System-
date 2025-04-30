import { Request, Response } from "express";
import axios from "axios";

import webTokenUtils from "../utils/webToken.utils";
import StudentService from "../services/student.service";
import SubscriptionService from "../services/subscription.service";
import { StatusCodes } from "../constant/StatusCode";
import { AdminInterface } from "../interface/admin.interface";

const subscriptionService = new SubscriptionService();

export class SubscriptionController {
  // Add subscription
  async addSubscription(req: Request, res: Response) {
    try {
      const admin_id = req.user?.id;
      const data = await subscriptionService.addSubscription(
        req.body);
      console.log("🚀 ~ SubscriptionController ~ addSubscription ~ data:", data);

      res.status(StatusCodes.SUCCESS).json({
        
        data,
        message: "Subscription added successfully",
      });
    } catch (error) {
      console.error("🚀 ~ SubscriptionController ~ addSubscription ~ error:", error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: error instanceof Error ? error.message : "Error while adding subscription",
      });
    }
  }

  // Get all subscriptions
  async getSubscription(req: Request, res: Response) {
    try {
      const data = await subscriptionService.getSubscription();
      res.status(StatusCodes.SUCCESS).json({
        data,
        message: "Subscriptions fetched successfully",
      });
    } catch (error) {
      console.error("🚀 ~ SubscriptionController ~ getSubscription ~ error:", error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: error instanceof Error ? error.message : "Error while fetching subscriptions",
      });
    }
  }

  async updateSubscription(req: Request, res: Response) {
    try {

      const subscription_id = req.params.id;

      const data = await subscriptionService.updateSubscription(
        subscription_id,
        req.body as AdminInterface
      );
      console.log("🚀 ~ SubscriptionController ~ updateSubscription ~ data:", data)
      res.status(StatusCodes.SUCCESS).json({
        data,
        message: "Subscription updated successfully",
      });

    } catch (error) {
      console.log("🚀 ~ SubscriptionController ~ updateSubscription ~ error:", error)
      
    }
  }

  async deleteSubscription(req: Request, res: Response) {
    try {
      const subscription_id = req.params.id;
      const data = await subscriptionService.deleteSubscription(subscription_id);
      res.status(StatusCodes.SUCCESS).json({
        data,
        message: "Subscription deleted successfully",
      });
    }
    catch (error) {
      console.error("🚀 ~ SubscriptionController ~ deleteSubscription ~ error:", error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: error instanceof Error ? error.message : "Error while deleting subscription",
      });
    }
  }

  async addUniSubscription(req: Request, res: Response) {
    try {
      const data = req.body;
      const uni_id = req.user.id;
      console.log("🚀 ~ SubscriptionController ~ addUniSubscription ~ data:", data);

      const saved = await subscriptionService.addUniSubscription(data, uni_id);

      res.status(StatusCodes.SUCCESS).json({
        data: saved,
        message: "University subscription added successfully",
      });
    } catch (error) {
      console.error("🚀 ~ SubscriptionController ~ addUniSubscription ~ error:", error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: error instanceof Error ? error.message : "Error while adding university subscription",
      });
    }
  }


  async initiatePayment(req: Request, res: Response) {
    try {
      const { orderId, amount } = req.body;

      if (!orderId || !amount) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Please provide both orderId and amount",
        });
      }

      const paymentPayload = {
        return_url: "http://localhost:5173/university/paymentsuccess",
        purchase_order_id: orderId,
        purchase_order_name: "Take subscription",
        amount: amount * 100, 
        website_url: "http://localhost:5173/",
      };

      const response = await axios.post(
        "https://a.khalti.com/api/v2/epayment/initiate/",
        paymentPayload,
        {
          headers: {
            Authorization: "key 3fb3d001f89c4fd7965e13ed9f96c6eb",
          },
        }
      );

      console.log("🚀 ~ initiatePayment ~ Khalti Response:", response.data);
      return res.status(StatusCodes.SUCCESS).json(response.data);

    } catch (error: any) {
      console.error("🚀 ~ initiatePayment ~ error:", error);

      return res.status(error?.response?.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Failed to initiate payment",
        error: error?.response?.data || error.message,
      });
    }
  }

  async getSubscriptiontime(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      if (!uni_id) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "University ID not provided" });
      }
  
      const timeLeft = await subscriptionService.getSubscriptionTime(uni_id);
  
      res.status(StatusCodes.SUCCESS).json({
        data: timeLeft,
        message: "Subscription time left fetched successfully"
      });
    } catch (error) {
      console.error("Error fetching subscription time left:", error);
      res.status(StatusCodes.BAD_REQUEST).json({
        message: error instanceof Error ? error.message : "Error while fetching subscription time left"
      });
    }
  }
  
}
