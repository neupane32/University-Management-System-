import universityService from "../services/university.service";
import { StatusCodes } from "../constant/StatusCode";
import { UniversityInterface } from "../interface/university.interface";
import { Request, Response } from "express";
import webTokenUtils from "../utils/webToken.utils";
import { ProgramInterface } from "../interface/program.interface";
import { ModuleInterface } from "../interface/module.interface";
import { TeacherInterface } from "../interface/teacher.interface";
import { StudentInterface } from "../interface/student.interface";
import { AnnouncementInterface } from "../interface/announcement.interface";
import HttpException from "../utils/HttpException.utils";

export class UniversityController {
  async createUniversity(req: Request, res: Response) {
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    if (!files) {
      throw HttpException.notFound("profile not found.");
    }
    console.log("🚀 ~ UniversityController ~ createUniversity ~ files:", files);
    const universityProfileImage = files?.["university_profile_image"]
      ? ` ${baseUrl}/${files["university_profile_image"][0].path.replace(/\\/g, "/")}`
      : null;
    try {
      const data = await universityService.createUniversity(
        req.body as UniversityInterface,
        universityProfileImage
      );
      const token = webTokenUtils.generateTokens(
        {
          id: data.id,
        },
        data.role
      );
      res.status(StatusCodes.CREATED).json({
        data: {
          id: data.id,
          email: data.email,
          tokens: {
            accessToken: token.accessToken,
          },
          message: "university registration Successfully",
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

  async loginUniversity(req: Request, res: Response) {
    try {
      const data = await universityService.loginUniversity(req.body);

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
          message: "university Login Successfully",
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

  async uniProfile(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      console.log("🚀 ~ UniversityController ~ uniProfile ~ uni_id:", uni_id);
      const data = await universityService.uniProfile(uni_id as string);
      res.status(StatusCodes.SUCCESS).json({
        data: data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      console.log(
        "🚀 ~ UniversityController ~ updateProfile ~ uni_id:",
        uni_id
      );
      const files = req.files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;
      const baseUrl = ` ${req.protocol}://${req.get("host")}`;
      const universityProfileImage = files?.["university_profile_image"]
        ? ` ${baseUrl}/${files["university_profile_image"][0].path.replace(/\\/g, "/")}`
        : null;

      const data = await universityService.updateProfile(
        uni_id as string,
        req.body as UniversityInterface,
        universityProfileImage
      );
      res.status(StatusCodes.SUCCESS).json({
        message: "successfully updated",
        data,
      });
    } catch (error: any) {
      console.log("🚀 ~ UniversityController ~ updateProfile ~ error:", error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async addProgram(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const data = await universityService.addProgram(
        uni_id as string,
        req.body as ProgramInterface
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async findProgram(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const data = await universityService.findProgram(uni_id as string);

      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async updateProgram(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const prog_id = req.params.id;

      const data = await universityService.updateProgam(
        uni_id as string,
        prog_id,
        req.body as ProgramInterface
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async deleteProgram(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const program_id = req.params.id;

      const data = await universityService.deleteProgram(
        uni_id as string,
        program_id
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async addModule(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const prog_id = req.params.id;

      const data = await universityService.addModule(
        uni_id as string,
        prog_id,
        req.body as ModuleInterface
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async updateModule(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const module_id = req.params.id;

      const data = await universityService.updateModule(
        uni_id as string,
        module_id,
        req.body as ModuleInterface
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async findModule(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const prog_id = req.params.id;
      console.log("🚀 ~ UniversityController ~ findModule ~ prog_id:", prog_id);

      const data = await universityService.findModules(uni_id as string);
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async deleteModule(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const module_id = req.params.id;

      const data = await universityService.deleteModule(
        uni_id as string,
        module_id
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async findModuleByProgram(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const prog_id = req.params.id;
      console.log("🚀 ~ UniversityController ~ findModule ~ prog_id:", prog_id);

      const data = await universityService.findModulesByProgram(
        uni_id as string,
        prog_id
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }
  async findModuleBySection(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const section_id = req.params.id;
      console.log(
        "🚀 ~ UniversityController ~ findModule ~ section_id:",
        section_id
      );

      const data = await universityService.findModulesBySection(
        uni_id as string,
        section_id
      );
      console.log(
        "🚀 ~ UniversityController ~ findModuleBySection ~ data:",
        data
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async findModuleByDuration(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const prog_id = req.params.id;
      const duration = req.params.duration;

      console.log("🚀 ~ UniversityController ~ findModule ~ prog_id:", prog_id);

      const data = await universityService.getModuleByDuration(
        uni_id as string,
        prog_id,
        parseInt(duration)
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

 
  async addTeacher(req: Request, res: Response) {
    try{
    const uni_id = req.user?.id;
    console.log("🚀 ~ UniversityController ~ addTeacher ~ uni_id:", uni_id)
  
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

      const data = await universityService.addTeacher(
        uni_id as string,
        teacherProfileImage,
        req.body
      );
      return res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async addTeacherBySection(req: Request, res: Response) {
    try {
      const data = req.body;
      console.log(
        "🚀 ~ UniversityController ~ addTeacherBySection ~ data:",
        data
      );

      const save = await universityService.addTeacherBySection(data);
      res.status(StatusCodes.SUCCESS).json({
        save,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async updateTeacher(req: Request, res: Response) {
    try{
    const uni_id = req.user?.id;

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

    const teacher_id = req.params.id;

      const data = await universityService.updateTeacher(
        uni_id as string,
        teacher_id as string,
        req.body as TeacherInterface,
        teacherProfileImage
      );
      console.log("🚀 ~ UniversityController ~ updateTeacher ~ data:", data)
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getTeacher(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const data = await universityService.getTeachers(uni_id as string);
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getTeacherByModule(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const module_id = req.params.id;
      const data = await universityService.getTeachersByModule(
        uni_id as string,
        module_id
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getTeacherById(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const teacher_id = req.params.id;

      const data = await universityService.getTeacherById(
        uni_id as string,
        teacher_id
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async deleteTeacher(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const teacher_id = req.params.id;

      const data = await universityService.deleteTeacher(
        uni_id as string,
        teacher_id,
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async addStudent(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    if (!files) {
      throw HttpException.notFound("profile not found.");
    }
    const studentProfileImage = files?.['student_profile_image']
    ? `${baseUrl}/${files['student_profile_image'][0].path.replace(/\\/g, "/")}`
    : null;

      const data = await universityService.addStudent(
        uni_id as string,
        studentProfileImage,
        req.body
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }
  async getStudent(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const data = await universityService.getStudent(uni_id as string);
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async editStudent(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;

      const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    if (!files) {
      throw HttpException.notFound("profile not found.");
    }
    const studentProfileImage = files?.['student_profile_image']
    ? `${baseUrl}/${files['student_profile_image'][0].path.replace(/\\/g, "/")}`
    : null;

      const student_id = req.params.id;

      const data = await universityService.editStudent(
        uni_id as string,
        student_id as string,
        req.body as StudentInterface,
        studentProfileImage
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async deleteStudent(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const student_id = req.params.id;

      const data = await universityService.deleteStudent(
        uni_id as string,
        student_id as string
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async postAnnouncement(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const data = req.body;

      const response = await universityService.postAnnouncement(uni_id, data);
      res.status(StatusCodes.SUCCESS).json({
        response,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getAnnouncement(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;

      const getAnnouncement = await universityService.getAnnouncement(uni_id);
      res.status(StatusCodes.SUCCESS).json({ data: getAnnouncement });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async updateAnnouncement(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const announcement_id = req.params.id;

      const data = await universityService.updateAnnouncement(
        uni_id as string,
        announcement_id,
        req.body as AnnouncementInterface
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async deleteAnnouncement(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const announcement_id = req.params.id;

      const data = await universityService.deleteAnnouncement(
        uni_id as string,
        announcement_id
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getTotalStudent(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const data = await universityService.getTotalStudent(uni_id as string);
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getTotalTeacher(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const data = await universityService.getTotalTeacher(uni_id as string);
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getTotalProgram(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const data = await universityService.getTotalProgram(uni_id as string);
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getTeacherStudentRatioByProgram(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const data = await universityService.getTeacherStudentRatioByProgram(
        uni_id as string
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getTeacherClassesBySectionForCurrentDate(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const data =
        await universityService.getTeacherClassesBySectionForCurrentDate(
          uni_id as string
        );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getTodayAnnouncement(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const data = await universityService.getTodayAnnouncements(
        uni_id as string
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getSubscriptionByUni(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const data = await universityService.getSubscriptionByUni(
        uni_id as string
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error) {
      console.log(
        "🚀 ~ UniversityController ~ getSubscriptionByUni ~ error:",
        error
      );
    }
  }
}
