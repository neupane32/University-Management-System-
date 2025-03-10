import { Request, Response } from "express";
import adminService from "../services/admin.service";
import { AdminInterface } from "../interface/admin.interface";
import { StatusCodes } from "../constant/StatusCode";
import webTokenUtils from "../utils/webToken.utils";
import { tokenToString } from "typescript";

export class RoutineController {

//      async createRoutine(req:Request, res: Response){
//     try {
//     //   const teacher_id = req.user?.id;
//     //   const module_id = req.user?.id;

//     //   const data = await teacherService.createRoutine(
//     //     teacher_id as string,
//     //     module_id as string,
//     //     req.body as ExamRoutineInterface
//       );
//       res.status(StatusCodes.SUCCESS).json({
//         data,
//       });
//     } catch (error: any) {
//       res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
//     }
//   }

}
