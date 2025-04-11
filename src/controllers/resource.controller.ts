
import { Request, Response } from "express";
import { StatusCodes } from "../constant/StatusCode";
import ResourceService from "../services/resource.service";

const resourceService = new ResourceService;

export class ResourceController {

  async addResource(req: Request, res: Response) {
    try {
      const teacher_id = req.user?.id;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const baseUrl = ` ${req.protocol}://${req.get('host')}`;

      const TeacherResourceFile = files?.['teacher_resource_file']
      ?`${baseUrl}/${files['teacher_resource_file'][0].path.replace(/\\/g, '/')}`
       : null;

       const data = await resourceService.addResource( req.body, TeacherResourceFile, teacher_id)
       res.status(StatusCodes.CREATED).json
      (
        data,
      );

      
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getResource(req:Request, res:Response){
    try {
      const teacher_id = req.user?.id;
      const module_id = req.params.id;

      const data = await resourceService.getResource(
        teacher_id as string,
        module_id
      )
      res.status(StatusCodes.SUCCESS).json
      ({
        success: true,
        data
      }
      );
      
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getResourceByStudent(req:Request, res:Response){
    try {
      const module_id = req.params.id;

      const data = await resourceService.getResourceByStudent(
        module_id
      )
      res.status(StatusCodes.SUCCESS).json
      ({
        success: true,
        data
      }
      );
      
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

    async deleteResource(req: Request, res: Response) {
      try {
        const teacher_id = req.user?.id;
        const resource_id = req.params.id;
  
        const data = await resourceService.deleteResource(
          teacher_id as string,
          resource_id
        );
        res.status(StatusCodes.SUCCESS).json({
          data,
        });
      } catch (error: any) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      }
    }
}
