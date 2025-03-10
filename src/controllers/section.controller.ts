import sectionService from "../services/section.service";
import { Request, Response } from "express";
import webTokenUtils from "../utils/webToken.utils";
import { SectionInterface } from "../interface/section.interface";
import { StatusCodes } from "../constant/StatusCode";

export class SectionController {

async addSection(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const prog_id = req.params.id;
      console.log("🚀 ~ SectionController ~ addSection ~ prog_id:", prog_id)

      const data = await sectionService.addSection(
        uni_id as string,
        prog_id,
        req.body as SectionInterface
      );
      res.status(StatusCodes.SUCCESS).json({
        data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getSections(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id; 
      const program_id = req.body.prog_id;
  
      const data = await sectionService.getSections(
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

     async updateSection(req: Request, res: Response) {
       try {
         const uni_id = req.user?.id;
         const section_id = req.params.id;
         console.log("🚀 ~ SectionController ~ updateSection ~ section_id:", section_id)
         const prog_id = req.params.prog_id;
         console.log("🚀 ~ SectionController ~ updateSection ~ prog_id:", prog_id)
   
         const data = await sectionService.updateSection(
           uni_id as string,
           section_id,
           req.body as SectionInterface, prog_id
         );
         res.status(StatusCodes.SUCCESS).json({
           data,
         });
       } catch (error: any) {
         res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
       }
     }
   
     async deleteSection(req: Request, res: Response) {
       try {
         const uni_id = req.user?.id;
         const section_id = req.params.id;
   
         const data = await sectionService.deleteSection(
           uni_id as string,
           section_id
         );
         res.status(StatusCodes.SUCCESS).json({
           data,
         });
       } catch (error: any) {
         res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
       }
     }
  
}
