import TeacherService from "../services/teacher.service";
import { Request, Response } from "express";
import { StatusCodes } from "../constant/StatusCode";
import webTokenUtils from "../utils/webToken.utils";
import { TeacherInterface } from "../interface/teacher.interface";
import HttpException from "../utils/HttpException.utils";
const teacherService = new TeacherService();

export class TeacherController {
  async loginTeacher(req: Request, res: Response) {
    try {
      const data = await teacherService.loginTeacher(req.body);
      const token = webTokenUtils.generateTokens(
        {
          id: data.id,
        },
        data.role
      );
      console.log("🚀 ~ teacherController ~ loginTeacher ~ token:", token);
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

  async teacherProfile(req: Request, res: Response) {
    try {
      const teacher_id = req.user?.id;
      const data = await teacherService.teacherProfile(teacher_id as string);
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    }
    catch (error: any) {
    console.log("🚀 ~ error:", error)
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const teacher_id = req.user?.id;

      const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    if (!files) {
      throw HttpException.notFound("profile not found.");
    }
    const teacherProfileImage = files?.["teacher_profile_image"]
      ? ` ${baseUrl}/${files["teacher_profile_image"][0].path.replace(/\\/g, "/")}`
      : null;

      const data = await teacherService.updateProfile(
        teacher_id as string,
        req.body as TeacherInterface,
        teacherProfileImage
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error) {
      console.log("🚀 ~ updateProfile ~ error:", error)
      
    }
  }

  async getTeacherByModule(req: Request, res: Response) {
    try {
      const teacher_id = req.user?.id;
      console.log(
        "🚀 ~ TeacherController ~ getTeacherByModule ~ teacher_id:",
        teacher_id
      );

      const data = await teacherService.getModulesByTeacher(
        teacher_id as string
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }
  async getTeacherSection(req: Request, res: Response) {
    try {
      const teacher_id = req.user.id;
      const data = await teacherService.getTeacherSections(
        teacher_id as string
      );
      console.log("🚀 ~ TeacherController ~ getTeacherSection ~ data:", data);
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error) {
      console.log("🚀 ~ TeacherController ~ getTeacherSection ~ error:", error);
    }
  }

  async getSectionsByModule(req: Request, res: Response) {
    try {
      const teacher_id = req.user?.id;
      const module_id = req.params.moduleId;
      const data = await teacherService.getSectionsByModule(
        teacher_id as string,
        module_id
      );
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getTeacherNotification(req: Request, res: Response) {
    try {
      const teacher_id = req.user?.id;

      const data = await teacherService.getTeacherNotifications(
        teacher_id as string
      );
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }
  async getModulesBySectionOfTeacher(req: Request, res: Response) {
    try {
      console.log("ladop");
      const sectionId = req.params.sectionId;
      const teacherId = req.user.id;

      const getModules = await teacherService.getModulesBySectionOfTeacher(
        sectionId,
        teacherId
      );
      res.status(400).json({
        data: getModules,
      });
    } catch (error) {
      console.log(
        "🚀 ~ TeacherController ~ getModulesBySectionOfTeacher ~ error:",
        error
      );
    }
  }
  async getSections(req:Request,res:Response){
    const teacherId= req.user.id
    const sections=await teacherService.getSections(teacherId)
    res.status(StatusCodes.SUCCESS).json({ data:sections });
  }

  async markAsRead(req:Request,res:Response){

    const {notificationId}=req.body
    const data= await teacherService.markAsRead(notificationId)
    res.status(StatusCodes.SUCCESS).json({ data });

  }

  async getPendingAssignment(req:Request,res:Response){
    const teacherId= req.user.id
    const data= await teacherService.getPendingAssignment(teacherId)
    res.status(StatusCodes.SUCCESS).json({ data });
  }


async  getAttendanceOverviewByTeacher(req:Request,res:Response){
  try {
    const teacherId= req.user.id
    const data= await teacherService.getAttendanceOverviewByTeacher(teacherId)
    res.status(StatusCodes.SUCCESS).json({ data });
    
  } catch (error) {
    console.log("🚀 ~ TeacherController ~ getAttendanceOverviewByTeacher ~ error:", error)
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    
  }
}

async getTodaySchedule(req:Request,res:Response){
  try {
    const teacherId= req.user.id
    const data= await teacherService.getTodayScheduleByTeacher(teacherId)

    res.status(StatusCodes.SUCCESS).json({ data });

    
  } catch (error) {
    console.log("🚀 ~ TeacherController ~ getTodaySchedule ~ error:", error)
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    
  }
}

async getTotalSection(req:Request,res:Response){
  try {
    const teacherId= req.user.id
    const data= await teacherService.getTotalSectionsByTeacher(teacherId)
    console.log("🚀 ~ TeacherController ~ getTotalSection ~ data:", data)

    res.status(StatusCodes.SUCCESS).json({ data });

    
  } catch (error) {
    console.log("🚀 ~ TeacherController ~ getTotalSection ~ error:", error)
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    
  }
}
}