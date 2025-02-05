import universityService from "../services/university.service";
import { StatusCodes } from "../constant/StatusCode";
import { UniversityInterface } from "../interface/university.interface";
import { Request, Response } from "express";
import webTokenUtils from "../utils/webToken.utils";
import { ProgramInterface } from "../interface/program.interface";
import { ModuleInterface } from "../interface/module.interface";
import { TeacherInterface } from "../interface/teacher.interface";
import { ResourceInterface } from "../interface/resource.interface";
import { StudentInterface } from "../interface/student.interface";

export class UniversityController {
  async createUniversity(req: Request, res: Response) {
    try {
      await universityService.createUniversity(req.body as UniversityInterface);
      res
        .status(StatusCodes.CREATED)
        .json({ message: "University Registred Successfully" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: error.message,
        });
      }
    }
  }

  async loginUniversity(req:Request, res:Response){
    try {
        const data = await universityService.loginUniversity(req.body);
        
        const token = webTokenUtils.generateTokens(
            {
                id: data.id,
            },
            data.role,
        );
        res.status(StatusCodes.SUCCESS).json({
            data: {
                id: data.id,
                email: data.email,
                tokens:{
                    accessToken: token.accessToken,
                },
                message: 'university Login Successfully'
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

  async addProgram(req:Request, res:Response){
    try {
        const uni_id = req.user?.id;
        const data  = await universityService.addProgram(uni_id as string, req.body as ProgramInterface);
        res.status(StatusCodes.SUCCESS).json({
            data:data,
        });
    }
    catch (error: any) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      }
  }

  async findProgram(req:Request, res:Response){
    try {
        const uni_id = req.user?.id;
        const data = await universityService.findProgram(uni_id as string);
        res.status(StatusCodes.SUCCESS).json({
            data,
        })
    } catch (error: any) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      }
  }

  async addModule(req:Request, res:Response) {
    try {
      const uni_id = req.user?.id
      const prog_id = req.params.id;

      const data = await universityService.addModule(uni_id as string, prog_id, req.body as ModuleInterface);
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async updateModule(req:Request, res:Response){
    try {
      const uni_id = req.user?.id
      const prog_id = req.params.id;

      const data = await universityService.updateModule(uni_id as string, prog_id, req.body as ModuleInterface)
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async findModule(req:Request, res:Response){
    try {
      const user_id = req.user?.id

      const data = await universityService.findModule(user_id as string)

      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async deleteModule(req:Request, res:Response){
    try {
      const uni_id = req.user?.id
      const module_id = req.params.id;

      const data  =await universityService.deleteModule(uni_id as string, module_id);
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async addTeacher(req:Request, res:Response){
    try {
      const uni_id = req.user?.id
      const data = await universityService.addTeacher(uni_id as string, req.body as TeacherInterface)
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async updateTeacher(req:Request, res:Response){
    try {
      const uni_id = req.user?.id
      const teacher_id = req.params.id
      const data = await universityService.updateTeacher(uni_id as string, teacher_id as string, req.body as TeacherInterface)
      res.status(StatusCodes.SUCCESS).json({
        data,
      })
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getTeacher(req:Request, res:Response){
    try {
      const uni_id = req.user?.id
      const data = await universityService.getTeachers(uni_id as string)
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getTeacherById(req:Request, res: Response){
    try {
      const uni_id = req.user?.id
      const teacher_id = req.params.id

      const data = await universityService.getTeacherById(uni_id as string, teacher_id)
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async deleteTeacher(req:Request, res:Response){
    try {
      const uni_id = req.user?.id
      const teacher_id = req.params.id

      const data = await universityService.deleteTeacher(uni_id as string, teacher_id)
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async addStudent(req:Request, res:Response){
    try {
      const uni_id = req.user?.id
      const data = await universityService.addStudent(uni_id as string, req.body as StudentInterface)
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
      
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }

  }
}


