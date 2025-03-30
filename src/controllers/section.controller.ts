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
      const data = req.body;
      console.log("🚀 ~ SectionController ~ addSection ~ data:", data)
  
      const addSection = await sectionService.addSection(
        uni_id as string,
        prog_id,
        data
      );
      res.status(StatusCodes.SUCCESS).json({
        addSection,
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

async getuniversitySection(req: Request, res: Response) {
  try {
    const uni_id = req.user?.id; 

    const data = await sectionService.getUniversitySections(
      uni_id as string
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
      const program_id = req.params.program_id;
      const data = req.body;

      console.log("🚀 ~ SectionController ~ updateSection ~ data:", data);

      const updatedSection = await sectionService.updateSection(
          uni_id as string,
          section_id,
          program_id,
          data
      );
      console.log("🚀 ~ SectionController ~ updateSection ~ updatedSection:", updatedSection)
      res.status(StatusCodes.SUCCESS).json({
          message: "Section updated successfully",
          updatedSection,
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
