import { Request, response, Response } from "express";
import routineService from "../services/routine.service";
import { StatusCodes } from "../constant/StatusCode";
import { RoutineInterface } from "../interface/routine.interface";

export class RoutineController {
  async createRoutine(req: Request, res: Response) {
    try {
      const data = req.body;
      console.log("🚀 ~ RoutineController ~ createRoutine ~ data:", data);
      const uni_id = req.user.id;

      const create = await routineService.createRoutine(uni_id, data);
      res.status(StatusCodes.SUCCESS).json({ data: create });
    } catch (error) {
      console.log("🚀 ~ RoutineController ~ createRoutine ~ error:", error);
    }
  }

  async getRoutine(req: Request, res: Response) {
    const section_id = req.params.id;
    console.log("🚀 ~ RoutineController ~ getRoutine ~ section_id:", section_id)
    const uni_id = req.user?.id;
    console.log("🚀 ~ RoutineController ~ getRoutine ~ uni_id:", uni_id)

    const getRoutine = await routineService.getRoutine(uni_id, section_id);
    res.json({ data: getRoutine });
  }

  async updateRoutine(req: Request, res: Response) {
    const uni_id = req.user?.id;
    const routine_id = req.params.id;
    const data = req.body;

    const update = await routineService.updateRoutine(
      uni_id as string,
      routine_id,
      data
    );
    res.status(StatusCodes.SUCCESS).json({
      data: update,
    });
  }

  async deleteRoutine(req: Request, res: Response) {
    const uni_id = req.user?.id;
    const routine_id = req.params.id;

    const data = await routineService.deleteRoutine(
      uni_id as string,
      routine_id
    );
    res.status(StatusCodes.SUCCESS).json({
      data,
    });
  }
}
