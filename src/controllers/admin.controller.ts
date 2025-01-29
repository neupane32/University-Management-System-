
import {Request, Response} from 'express'
    import adminService from "../services/admin.service";
import { AdminInterface } from "../interface/admin.interface";
import { StatusCodes } from "../constant/StatusCode";

export class AdminController {
    async createAdmin(req: Request, res: Response) {
        try {
            const body = req.body as AdminInterface
            console.log("🚀 ~ AdminController ~ createAdmin ~ body:", body)
            await adminService.createAdmin(body);
            res.status(StatusCodes.CREATED).json({ message: 'Admin Registred Successfully' });

        } catch (error) {
            if (error instanceof Error) {
              res.status(StatusCodes.BAD_REQUEST).json({
                message: error.message,
              });
            }
          }
    }
}