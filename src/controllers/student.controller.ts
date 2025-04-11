import webTokenUtils from "../utils/webToken.utils";
import StudentService from "../services/student.service";
import { StatusCodes } from "../constant/StatusCode";
import { Request, Response } from "express";
import TeacherService from "../services/teacher.service";


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

  async getAssignments (req: Request, res: Response) {
    try {
        const module_id = req.params.module_id;
        const data = await studentService.getAssignments(module_id);

        res.status(StatusCodes.SUCCESS).json({
            data,
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }
    async studentProfile(req: Request, res: Response) {
      try {
        const student_id = req.user?.id;
        console.log("🚀 ~ UniversityController ~ uniProfile ~ uni_id:", student_id)
        const data = await studentService.studentProfile(
          student_id as string,
        );
        res.status(StatusCodes.SUCCESS).json({
          data: data,
        });
      } catch (error: any) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      }
    }
async getStudentModules(req:Request,res:Response){
  try{
    const student_id = req.user?.id
const data = await studentService.getStudentModules(student_id);
console.log("🚀 ~ StudentController ~ getStudentModules ~ data:", data)
res.status(StatusCodes.SUCCESS).json({
  data: data,
});
  }catch(error){
  console.log("🚀 ~ StudentController ~ getStudentModules ~ error:", error)

  }
}

  

// async getRoutine(req:Request, res:Response){
//   try {
//     const student_id = req.params.id;
//     const data = await studentService.getApproveRoutine(student_id);

//     res.status(StatusCodes.SUCCESS).json({ data,
//       message: "Routine get successfully",
//      });
//   } catch (error: any) {
//       res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
//   }
// }
}
