import sectionService from "../services/section.service";
import { Request, Response } from "express";
import webTokenUtils from "../utils/webToken.utils";
import { SectionInterface } from "../interface/section.interface";
import { StatusCodes } from "../constant/StatusCode";

export class SectionController {
  async addSection(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id;
      const prog_id = req.body.prog_id;

      const data = await sectionService.addSection(
        uni_id as string,
        prog_id as string,
        req.body as SectionInterface
      );
      res.status(StatusCodes.SUCCESS).json({
        data: data,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getSections(req: Request, res: Response) {
    try {
      const uni_id = req.user?.id; 
      const program_id = req.body.prog_id;
  
      const sections = await sectionService.getSections(uni_id as string, program_id);
      res.status(StatusCodes.SUCCESS).json({
        data: sections,
      });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }
  
}
