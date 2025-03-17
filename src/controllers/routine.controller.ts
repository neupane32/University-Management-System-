import { Request, response, Response } from "express";
import routineService from "../services/routine.service";
import { StatusCodes } from "../constant/StatusCode";

export class RoutineController {
  async createRoutine(req: Request, res: Response) {
    const data = req.body;
    const uni_id = req.user.id;

    const create = await routineService.createRoutine(uni_id, data);
    res.status(StatusCodes.SUCCESS).json({ data: create });
  }

  async getRoutine(req:Request, res: Response){
   const section_id = req.params.id;
   const uni_id = req.user?.id;
   
   const getRoutine = await routineService.getRoutine(
      uni_id, section_id
   )
   res.json({data: getRoutine})
  }
}
