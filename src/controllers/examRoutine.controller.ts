import { Request, response, Response } from "express";
import { StatusCodes } from "../constant/StatusCode";
import examRoutineService from "../services/examRoutine.service";


export class ExamRoutineController {
  async createExamRoutine(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const data = req.body;

      const examRoutine = await examRoutineService.createExamRoutine(
        uni_id as string,
        data
      );
      console.log("🚀 ~ ExamRoutineController ~ createExamRoutine ~ examRoutine:", examRoutine)
      res.status(StatusCodes.SUCCESS).json({ data: examRoutine });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Failed to create exam routine",
      });
    }
  }

  async getExamRoutine(req:Request, res:Response){
    try {
      const uni_id = req.user?.id;

      const data = await examRoutineService.getExamRoutine(
        uni_id as string
      );
      res.status(StatusCodes.SUCCESS).json({
        data
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getExamRoutineByTeacher(req: Request, res: Response) {
    try {
      const teacher_id = req.user?.id as string;
      const data = await examRoutineService.getExamRoutineByTeacher(teacher_id);
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: any) {
      res.status(error.status || StatusCodes.BAD_REQUEST);
    }
  }

  
    async getExamRoutineByStudent(req:Request, res: Response){
      try {
        const student_id = req.user?.id;
  
        const getExamRoutine = await examRoutineService.getExamRoutineByStudent(student_id);
        console.log("🚀 ~ ExamRoutineController ~ getExamRoutineByStudent ~ getExamRoutine:", getExamRoutine)
        res.status(StatusCodes.SUCCESS).json({ data: getExamRoutine });
      } catch (error) {
        console.log("🚀 ~ RoutineController ~ createRoutine ~ error:", error);
      }
    }

  async updateExamRoutine(req: Request, res:Response){
    try {
      const uni_id = req.user?.id;
      const examRoutine_id = req.params.id;

      const updateExamRoutine = await examRoutineService.updateExamRoutine(
        uni_id as string,
        examRoutine_id,
        req.body
      );
      res.status(StatusCodes.SUCCESS).json({
        data: updateExamRoutine
      })
      
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async deleteExamRoutine(req:Request, res:Response){
    try {
      const uni_id = req.user?.id;
      const examRoutine_id = req.params.id;

      const data = await examRoutineService.deleteExamRoutine(
        uni_id as string,
        examRoutine_id
      );
      res.status(StatusCodes.SUCCESS).json(
        data
      );
      
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }
}
