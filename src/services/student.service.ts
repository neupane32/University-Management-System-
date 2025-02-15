import { Student } from "../entities/student/student.entity";
import { AppDataSource } from "../config/database.config";
import { University } from "../entities/university/university.entity";
import { StudentInterface } from "../interface/student.interface";
import HttpException from "../utils/HttpException.utils";
import BcryptService from "../utils/bcrypt.utils";
import { Announcement } from "../entities/announcement/announcement.entity";
import { Assignment } from "../entities/Assignment/assignment.entity";
import { ExamRoutine } from "../entities/examRoutine/examRoutine.entity";

const bcryptService = new BcryptService();
class StudentService {
  constructor(
    private readonly studentRepo = AppDataSource.getRepository(Student),
    private readonly uniRepo = AppDataSource.getRepository(University),
    private readonly announceRepo = AppDataSource.getRepository(Announcement),
    private readonly assignmentRepo = AppDataSource.getRepository(Assignment),
    private readonly routineRepo = AppDataSource.getRepository(ExamRoutine),
    
  ) {}

  async loginStudent(data: StudentInterface): Promise<University> {
    try {
      const student = await this.studentRepo.findOne({
        where: [{ email: data.email }],
        select: ["id", "email", "password"],
      });

      if (!student)
        throw HttpException.badRequest("Entered Email is not regustred yet!!");
      const isPassword = await bcryptService.compare(
        data.password,
        student.password
      );
      if (!isPassword) throw HttpException.badRequest("Incorrect password");

      return await this.getStudentById(student.id);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid credentials");
      }
    }
  }

  async getStudentById(id: string): Promise<University> {
    try {
        const query = this.uniRepo
        .createQueryBuilder('uni')
        .where('uni.id = :id', { id });

        const teach = await query.getOne();
        if(!teach) throw new Error ( 'Teacher not found');
        return teach;
    } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error('User not found');
        }
      }
  }

  async getAnnouncments(module_id: string) {
    try {
            const announcements = await this.announceRepo.find({
                where: { module: { id: module_id } },
                relations: ["teacher", "module"],
                order: { announce_date: "DESC" }
            });

            if (!announcements.length) {
                throw new Error("No announcements found for this module");
            }

            return announcements;
        
    } catch (error) {
        throw new Error(error.message || "Failed to fetch announcements");
    }
  }

  async getAssignments(module_id: string) {
    try {
        const assignments = await this.assignmentRepo.find({
            where: {module: { id: module_id}},
            relations: ["teacher", "module"],
            order: {due_date: "DESC"}
        });

        if(!assignments.length){ 
            throw new Error("No Assignments found for this module");
        }

        return assignments;

    } catch (error) {
        throw new Error(error.message || "Failed to fetch assignments");
    }
  }
}
export default StudentService
