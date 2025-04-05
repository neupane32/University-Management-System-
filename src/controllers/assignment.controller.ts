import { Request, Response } from "express";
import { StatusCodes } from "../constant/StatusCode";
import AssignmentService from "../services/Assignment.Service";

const assignmentService = new AssignmentService();

export class AssignmentController {
  async addAssignment(req: Request, res: Response) {
    try {
      const teacher_id = req.user?.id;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const uploadedFiles = files["teacher_assignment_file"];

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
}
