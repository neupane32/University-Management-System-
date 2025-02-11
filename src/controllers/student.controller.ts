import webTokenUtils from "../utils/webToken.utils";
import StudentService from "../services/student.service";
import { StatusCodes } from "../constant/StatusCode";
import { Request, Response } from "express";


const studentService = new StudentService();

export class StudentController {
  async loginStudent(req: Request, res: Response) {
    try {
      const data = await studentService.loginStudent(req.body);
      const token = webTokenUtils.generateTokens(
        {
          id: data.id,
        },
        data.role
      );
      res.status(StatusCodes.SUCCESS).json({
              data: {
                id: data.id,
                email: data.email,
                tokens: {
                  accessToken: token.accessToken,
                },
                message: "Loggedin successfully",
              },
            });
    } catch (error) {
        if (error instanceof Error) {
          res.status(StatusCodes.BAD_REQUEST).json({
            message: error.message,
          });
        } else {
          res.status(StatusCodes.BAD_REQUEST).json({
            message: "error while logging in",
          });
        }
      }
  }

  async getAnnouncements(req:Request, res:Response){
    try {
        const module_id = req.params.module_id;

        const data = await studentService.getAnnouncments(module_id);

        res.status(StatusCodes.SUCCESS).json({
            data,
        });

    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }
}
