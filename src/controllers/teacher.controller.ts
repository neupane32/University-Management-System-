import { ResourceInterface } from "../interface/resource.interface";
import TeacherService from "../services/teacher.service";
import { Request, Response } from "express";
import { StatusCodes } from "../constant/StatusCode";

const teacherService = new TeacherService();

export class TeacherController {

    async addResource(req: Request, res: Response){
        try {
            const content = (req.files as Express.Multer.File[])?.map((file: Express.Multer.File) => {
                return {
                    name: file?.filename,
                    mimetype: file?.mimetype,
                    type: req.body?.type,
                };
              });
              const userId = req.user?.id as string
              const moduleId = req.body?.module_id as string;

              const data = await teacherService.addResource(
                userId,
                moduleId,
                content as any,
                req.body as ResourceInterface,
              );
              res.status(StatusCodes.SUCCESS).json({
                data,
              });
            } catch (error: any) {
              res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
            }
    }


    async updateResource(req: Request, res: Response){
        try {
            const content = (req.files as Express.Multer.File[])?.map((file: Express.Multer.File) => {
                return {
                    name: file?.filename,
                    mimetype: file?.mimetype,
                    type: req.body?.type,
                };
              });
              const userId = req.user?.id as string
              const resource_id = req.params.id;
              const moduleId = req.body?.module_id as string;

              const data = await teacherService.updateResource(
                resource_id,
                userId,
                moduleId,
                content as any,
                req.body as ResourceInterface,
              );
              res.status(StatusCodes.SUCCESS).json({
                data,
              });
            } catch (error: any) {
              res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
            }
    }


}