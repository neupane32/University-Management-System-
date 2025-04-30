import { Request, Response } from "express";
import { StatusCodes } from "../constant/StatusCode";
import attendanceService from "../services/attendance.service";


export class AttendanceController {


  async addAttendance(req: Request, res: Response) {
    try {
      const teacher_id = req.user?.id;

      const data = await attendanceService.addAttendace(
        req.body,
        teacher_id
      );
      res.status(StatusCodes.CREATED).json(data);
    } catch (error: any) {
      console.log("🚀 ~ addAttendance ~ error:", error)
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }

  async getSectionStudents(req: Request, res: Response) {
    try {
      const teacherId = req.user?.id;
      const sectionId = req.params.sectionId;
      const data = await attendanceService.getStudentsBySection(sectionId, teacherId);
      res.status(StatusCodes.SUCCESS).json({ data });
    } catch (error: any) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
  }
  
  async getAttendanceByDate(req:Request,res:Response){
    try{

        const sectionId=req.params.sectionId
        console.log("🚀 ~ AttendanceController ~ getAttendanceByDate ~ sectionId:", sectionId)
        const date=req.params.date
        console.log("🚀 ~ AttendanceController ~ getAttendanceByDate ~ date:", date)
        const data= await attendanceService.getAttendanceByDate(sectionId,date)
        res.status(StatusCodes.SUCCESS).json({data})
    }catch(error:any){
    console.log("🚀 ~ AttendanceController ~ getAttendanceByDate ~ error:", error)
    }
  }
  async getStudentAttendance(req:Request,res:Response){
    try{
const studentId= req.params.studentId
console.log("🚀 ~ AttendanceController ~ getStudentAttendance ~ studentId:", studentId)
const data= await attendanceService.getStudentAttendance(studentId)
res.status(StatusCodes.SUCCESS).json({data})

    }catch(error){
        console.log("🚀 ~ AttendanceController ~ getStudentAttendance ~ error:", error)
        
    }
  }

}
