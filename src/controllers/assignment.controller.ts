import { Request, Response } from "express";
import { StatusCodes } from "../constant/StatusCode";
import AssignmentService from "../services/assignment.Service"

const assignmentService = new AssignmentService();

export class AssignmentController {
  async addAssignment(req: Request, res: Response) {
    try {
      const teacher_id = req.user?.id;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const uploadedFiles = files["teacher_assignment_file"];
      console.log("🚀 ~ AssignmentController ~ addAssignment ~ uploadedFiles:", uploadedFiles)

      const file = uploadedFiles?.map((file, index) => {
        return {
          filename: file.filename,
          path: file.path,
        };
      });

      console.log("🚀 ~ AssignmentController ~ addAssignment ~ files:", files);

      const data = await assignmentService.addAssignment(
        req.body,
        file,
        teacher_id
      );
      console.log('VAYO TA --------------------------------------------------')
      res.status(StatusCodes.CREATED).json(data);
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getAssignment(req: Request, res: Response) {
    try {
      const teacherId = req.user?.id as string;
      const data = await assignmentService.getAssignment(teacherId);
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ error });
    }
  }

  async updateAssignment(req: Request, res: Response) {
    try {
      const teacher_id = req.user?.id;
      const assignmentId = req.params.id;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const uploadedFiles = files["teacher_assignment_file"];

      const file = uploadedFiles?.map((file, index) => {
        return {
          filename: file.filename,
          path: file.path,
        };
      });

      const data = req.body;

      const updatedAssignment = await assignmentService.updateAssignment(
        teacher_id,
        assignmentId,
        file,
        data
      );

      res.status(StatusCodes.SUCCESS).json({
        message: "Assignment updated successfully",
        data: updatedAssignment,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async deleteAssignmentFile(req: Request, res: Response) {
    try {
      const teacher_id = req.user?.id;
      const assignment_id = req.params.id;
      const fileId = req.params.fileId;
      console.log(
        "🚀 ~ AssignmentController ~ deleteAssignmentFile ~ fileId:",
        fileId
      );

      const data = await assignmentService.deleteAssignmentFile(
        teacher_id as string,
        assignment_id,
        fileId
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async deleteAssignment(req: Request, res: Response) {
    try {
      const teacher_id = req.user?.id;
      const assignment_id = req.params.id;

      const data = await assignmentService.deleteAssignment(
        teacher_id as string,
        assignment_id
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async submitAssignment(req: Request, res: Response) {
    try {
      const studentId = req.user?.id;
      const assignmentId = req.params.id
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const uploadedFiles = files["student_assignment_file"];

      const file = uploadedFiles?.map((file, index) => {
        return {
          filename: file.filename,
          path: file.path,
        };
      });

      console.log("🚀 ~ AssignmentController ~ addAssignment ~ files:", files);

      const data = await assignmentService.submitAssignment(
        studentId,
        assignmentId,
        file,
        req.body,
      );
      res.status(StatusCodes.CREATED).json(data);
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getAssignmentByStudent(req: Request, res: Response) {
    try {
      const student_id = req.user?.id;
      const moduleId = req.params.moduleId;
      console.log("🚀 ~ AssignmentController ~ getAssignmentByStudent ~ module_id:", moduleId)

      const data = await assignmentService.getAssignmentByStudent(
        student_id,
        moduleId
    );
      console.log("🚀 ~ AssignmentController ~ getAssignmentByStudent ~ data:", data)
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ error });
    }
  }

  
  async updateAssignmentByStudent(req: Request, res: Response) {
    try {
      const student_id = req.user?.id;
      const assignmentId = req.params.id;
      console.log("🚀 ~ AssignmentController ~ updateAssignmentByStudent ~ assignmentId:", assignmentId)
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const uploadedFiles = files["student_assignment_file"];

      const file = uploadedFiles?.map((file, index) => {
        return {
          filename: file.filename,
          path: file.path,
        };
      });

      const data= req.body;

      const updateAssignment = await assignmentService.updateAssignmentByStudent(
        student_id,
        assignmentId,
        file,
        data
      );

      res.status(StatusCodes.SUCCESS).json({
        message: "Assignment updated by student successfully",
        data: updateAssignment,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async deleteAssignmentFileByStudent(req: Request, res: Response) {
    try {
      const student_id = req.user?.id;
      const submissionAssignment_id = req.params.id;
      const fileId = req.params.fileId;

      const data = await assignmentService.deleteAssignmentFileByStudent(
        student_id as string,
        submissionAssignment_id,
        fileId
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }
  async getSubmittedAssigment(req:Request,res:Response){
    try{
      const assigment_id = req.params.assigment_id
      const data= await assignmentService.getSubmittedAssigment(assigment_id)
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
      
    }catch(error){

    }
  }
}
