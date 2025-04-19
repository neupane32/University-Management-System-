import webTokenUtils from "../utils/webToken.utils";
import StudentService from "../services/student.service";
import { StatusCodes } from "../constant/StatusCode";
import { Request, Response } from "express";
import TeacherService from "../services/teacher.service";
import HttpException from "../utils/HttpException.utils";
import { StudentInterface } from "../interface/student.interface";

const studentService = new StudentService();

export class StudentController {
  async loginStudent(req: Request, res: Response) {
    try {
      const data = await studentService.loginStudent(req.body);
      const token = webTokenUtils.generateTokens(
        {
          id: data.id,
        },
        data.role
      );
      res.status(StatusCodes.SUCCESS).json({
        data: {
          id: data.id,
          email: data.email,
          tokens: {
            accessToken: token.accessToken,
          },
          message: "Loggedin successfully",
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

  async getProfile(req: Request, res: Response) {
    try {
      const student_id = req.user?.id;
      const data = await studentService.getProfile(student_id as string);
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      console.log("🚀 ~ error:", error);
    }
  }

  async getAnnouncements(req: Request, res: Response) {
    try {
      const module_id = req.params.module_id;

      const data = await studentService.getAnnouncments(module_id);

      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getAnnouncementsByStudent(req:Request, res:Response) {
    try {
      const student_id = req.user?.id;
      const data = await studentService.getAnnouncementsByStudent(
        student_id as string
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getAssignments(req: Request, res: Response) {
    try {
      const module_id = req.params.module_id;
      const data = await studentService.getAssignments(module_id);

      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }
  async studentProfile(req: Request, res: Response) {
    try {
      const student_id = req.user?.id;
      console.log(
        "🚀 ~ UniversityController ~ uniProfile ~ uni_id:",
        student_id
      );
      const data = await studentService.studentProfile(student_id as string);
      res.status(StatusCodes.SUCCESS).json({
        data: data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const student_id = req.user?.id;

      const files = req.files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      if (!files) {
        throw HttpException.notFound("profile not found.");
      }
      const teacherProfileImage = files?.["student_profile_image"]
        ? ` ${baseUrl}/${files["student_profile_image"][0].path.replace(/\\/g, "/")}`
        : null;

      const data = await studentService.updateProfile(
        student_id as string,
        req.body as StudentInterface,
        teacherProfileImage
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error) {
      console.log("🚀 ~ updateProfile ~ error:", error);
    }
  }
  async getStudentModules(req: Request, res: Response) {
    try {
      const student_id = req.user?.id;
      const data = await studentService.getStudentModules(student_id);
      console.log("🚀 ~ StudentController ~ getStudentModules ~ data:", data);
      res.status(StatusCodes.SUCCESS).json({
        data: data,
      });
    } catch (error) {
      console.log("🚀 ~ StudentController ~ getStudentModules ~ error:", error);
    }
  }
  async getStudentNotification(req: Request, res: Response) {
    try {
      const student_id = req.user?.id;

      const data = await studentService.getStudentNotifications(
        student_id as string
      );
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async markAsRead(req: Request, res: Response) {
    const { notificationId } = req.body;
    const data = await studentService.markAsRead(notificationId);
    res.status(StatusCodes.SUCCESS).json({ data });
  }

  async getTodaySchedule(req: Request, res: Response) {
    try {
      const student_id = req.user?.id;
      const data = await studentService.getTodaySchedule(student_id as string);
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
      
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
    }
}
