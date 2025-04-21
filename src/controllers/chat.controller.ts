import { Request, Response } from "express";
import { StatusCodes } from "../constant/StatusCode";

import chatService from "../services/chat.service";

export class ChatController {
  async addChat(req: Request, res: Response) {
    try {
      const { message, senderType, receiverType, receiverId } = req.body;
      console.log(
        "🚀 ~ ChatController ~ addChat ~ message,senderType,receiverType,receiverId:",
        message,
        senderType,
        receiverType,
        receiverId
      );
      const senderId = req.user.id;
      const data = await chatService.addChat(
        message,
        senderType,
        senderId,
        receiverType,
        receiverId
      );
      return res.status(StatusCodes.SUCCESS).json({
        data,
        message: "Chat message saved successfully",
      });
    } catch (err) {
      console.log("🚀 ~ ChatController ~ addChat ~ err:", err);
    }
  }
  async getChat(req: Request, res: Response) {
    const currentId = req.user.id;
    const otherId = req.params.id;
    const messages = await chatService.getChatBetweenUsers(currentId, otherId);
    return res.status(StatusCodes.SUCCESS).json({ data: messages });
  }

  async getStudent(req: Request, res: Response) {
    try {
      const teacher_id = req.user?.id;
      console.log("🚀 ~ ChatController ~ getStudent ~ teacher_id:", teacher_id);
      const data = await chatService.getStudent(teacher_id as string);
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      console.log("🚀 ~ ChatController ~ getStudent ~ error:", error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getTeachers(req: Request, res: Response) {
    try {
      const teacher_id = req.user?.id;
      console.log("🚀 ~ ChatController ~ getStudent ~ teacher_id:", teacher_id);
      const data = await chatService.getTeachers(teacher_id as string);
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      console.log("🚀 ~ ChatController ~ getStudent ~ error:", error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getStudentByStudent(req: Request, res: Response) {
    try {
      const student_id = req.user?.id;
      console.log("🚀 ~ ChatController ~ getStudent ~ teacher_id:", student_id);
      const data = await chatService.getStudentByStudent(student_id as string);
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      console.log("🚀 ~ ChatController ~ getStudent ~ error:", error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getTeachersByStudent(req: Request, res: Response) {
    try {
      const student_id = req.user?.id;
      console.log("🚀 ~ ChatController ~ getStudent ~ teacher_id:", student_id);
      const data = await chatService.getTeachersByStudent(student_id as string);
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      console.log("🚀 ~ ChatController ~ getStudent ~ error:", error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }
}
