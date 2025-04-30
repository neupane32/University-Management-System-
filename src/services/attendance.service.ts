import { AppDataSource } from "../config/database.config";
import { Teacher } from "../entities/teacher/teacher.entity";
import { DotenvConfig } from "../config/env.config";
import { Student } from "../entities/student/student.entity";
import { Attendance } from "../entities/Attendance/attendance.entity";
import { Section } from "../entities/Section/section.entity";
import { Teacher_Section } from "../entities/TeacherSection/TeacherSection.entity";

class AttendanceService {
  constructor(
    private readonly teacherRepo = AppDataSource.getRepository(Teacher),
    private readonly studentRepo = AppDataSource.getRepository(Student),
    private readonly attendanceRepo = AppDataSource.getRepository(Attendance),
    private readonly sectionRepo = AppDataSource.getRepository(Section),
    private readonly teacherSectionRepo = AppDataSource.getRepository(
      Teacher_Section
    )
  ) {}

  async addAttendace(data: any, teacher_id: string) {
    console.log("🚀 ~ AttendanceService ~ data:", data);
    const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
    if (!teacher) throw new Error("Teacher Not found");

    const { sectionId, date, attendances } = data;

    const teacherSection = await this.teacherSectionRepo.findOne({
      where: { teacher: { id: teacher_id }, section: { id: sectionId } },
    });

    if (!teacherSection)
      throw new Error("Teacher not assigned to this section");

    const formattedDate = new Date(date);

    for (const att of attendances) {
      const existing = await this.attendanceRepo.findOne({
        where: {
          student: { id: att.studentId },
          section: { id: sectionId },
          date: formattedDate,
        },
      });

      if (existing) {
        existing.status = att.status;
        await this.attendanceRepo.save(existing);
      } else {
        const newAttendance = new Attendance();
        newAttendance.student = { id: att.studentId } as Student;
        newAttendance.section = { id: sectionId } as Section;
        newAttendance.date = formattedDate;
        newAttendance.status = att.status;
        await this.attendanceRepo.save(newAttendance);
      }
    }

    return { message: "Attendance recorded successfully" };
  }

  async getStudentsBySection(sectionId: string, teacherId: string) {
    try {
      const teacherSection = await this.teacherSectionRepo.findOne({
        where: {
          teacher: { id: teacherId },
          section: { id: sectionId },
        },
      });

      if (!teacherSection)
        throw new Error("Teacher not assigned to this section");

      const section = await this.sectionRepo.findOne({
        where: { id: sectionId },
        relations: ["students"],
      });

      if (!section) throw new Error("Section not found");
      return section.students;
    } catch (error) {
      console.log("🚀 ~ getStudentsBySection ~ error:", error);
    }
  }
  async getAttendanceByDate(sectionId: any, date: any) {
    try {
      const getAttendanceByDate = await this.attendanceRepo.find({
        where: {
          section: {
            id: sectionId,
          },
          date,
        },
        relations: ["student"],
      });
      console.log(
        "🚀 ~ AttendanceService ~ getAttendanceByDate ~ getAttendanceByDate:",
        getAttendanceByDate
      );

      return getAttendanceByDate;
    } catch (error) {
      console.log("🚀 ~ getAttendanceByDate ~ error:", error);
    }
  }
  async getStudentAttendance(studentId: string) {
    try {
      const getStudentAttendance = await this.attendanceRepo.find({
        where: {
          student: {
            id: studentId,
          },
        },
        relations: ["student"],
      });
      return getStudentAttendance;
    } catch (error) {
      console.log("🚀 ~ getStudentAttendance ~ error:", error);
    }
  }
}
export default new AttendanceService();
