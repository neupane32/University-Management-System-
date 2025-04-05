import TeacherService from "../services/teacher.service";
import { Request, Response } from "express";
import { StatusCodes } from "../constant/StatusCode";
import webTokenUtils from "../utils/webToken.utils";


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

  async getTeacherByModule(req: Request, res: Response) {
      try {
        const teacher_id = req.user?.id;
        console.log("🚀 ~ TeacherController ~ getTeacherByModule ~ teacher_id:", teacher_id)

        const data = await teacherService.getModulesByTeacher(teacher_id as string);
        res.status(StatusCodes.SUCCESS).json({
          data,
        });
      } catch (error: any) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      }
    }
    async getTeacherSection(req:Request,res:Response){
      try{
        const teacher_id=req.user.id;
        const data=await teacherService.getTeacherSections(teacher_id as string)
        console.log("🚀 ~ TeacherController ~ getTeacherSection ~ data:", data)
        res.status(StatusCodes.SUCCESS).json({data})
      }catch(error){
        
      console.log("🚀 ~ TeacherController ~ getTeacherSection ~ error:", error)

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
}
