import universityService from "../services/university.service";
import { StatusCodes } from "../constant/StatusCode";
import { UniversityInterface } from "../interface/university.interface";
import { Request, Response } from "express";
import webTokenUtils from "../utils/webToken.utils";
import { ProgramInterface } from "../interface/program.interface";
import { ModuleInterface } from "../interface/module.interface";

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
}
