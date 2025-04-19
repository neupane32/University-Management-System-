import { Student } from "../entities/student/student.entity";
import { AppDataSource } from "../config/database.config";
import { University } from "../entities/university/university.entity";
import { StudentInterface } from "../interface/student.interface";
import HttpException from "../utils/HttpException.utils";
import BcryptService from "../utils/bcrypt.utils";
import { Announcement } from "../entities/announcement/announcement.entity";
import { Assignment } from "../entities/Assignment/assignment.entity";
import { submitAssignmnet } from "../entities/Assignment/submitAssignment.entity";
import { Notification } from "../entities/notification/notification.entity";
import { Section } from "../entities/Section/section.entity";
import { Routine } from "../entities/Routine/routine.entity";

const bcryptService = new BcryptService();
class StudentService {
  constructor(
    private readonly studentRepo = AppDataSource.getRepository(Student),
    private readonly sectionRepo = AppDataSource.getRepository(Section),
    private readonly routineRepo = AppDataSource.getRepository(Routine),
    private readonly announceRepo = AppDataSource.getRepository(Announcement),
    private readonly assignmentRepo = AppDataSource.getRepository(Assignment),
    private readonly submissionRepo = AppDataSource.getRepository(
      submitAssignmnet
    ),
    private readonly notificationRepo = AppDataSource.getRepository(
      Notification
    )
  ) {}

  async loginStudent(data: StudentInterface): Promise<Student> {
    try {
      const student = await this.studentRepo.findOne({
        where: [{ email: data.email }],
        select: ["id", "email", "password", "role"],
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

  async getProfile(student_id: string) {
    try {
      const student = await this.studentRepo.findOneBy({ id: student_id });
      if (!student) throw new Error("Student Not Found");

      return student;
    } catch (error) {
      console.log("🚀 ~ StudentService ~ getProfile ~ error:", error);
    }
  }

  async getStudentById(id: string): Promise<Student> {
    try {
      const student = this.studentRepo
        .createQueryBuilder("uni")
        .where("uni.id = :id", { id });

      const teach = await student.getOne();
      if (!teach) throw new Error("Student not found");
      return teach;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("User not found");
      }
    }
  }

  async getAnnouncments(module_id: string) {
    try {
      const announcements = await this.announceRepo.find({
        where: { module: { id: module_id } },
        relations: ["teacher", "module"],
        order: { announce_date: "DESC" },
      });

      if (!announcements.length) {
        throw new Error("No announcements found for this module");
      }

      return announcements;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch announcements");
    }
  }

  async getAnnouncementsByStudent(student_id: string) {
    try {
      const student = await this.studentRepo.findOne({
        where: { id: student_id },
        relations: ["uni"]
      });
      if (!student) {
        throw new Error("Student not found");
      }

      const announcements = await this.announceRepo.find({
        where: { university: { id: student.uni.id } },
        relations: ["university"]
      });
    
      if (!announcements.length) {
        throw new Error("No announcements found for this university");
      }
    
      return announcements;
    } catch (error) {
      console.log("🚀 ~ StudentService ~ getAnnouncementsByStudent ~ error:", error)
    }
  }

  async getAssignments(module_id: string) {
    try {
      const assignments = await this.assignmentRepo.find({
        where: { module: { id: module_id } },
        relations: ["teacher", "module"],
        order: { due_date: "DESC" },
      });

      if (!assignments.length) {
        throw new Error("No Assignments found for this module");
      }

      return assignments;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch assignments");
    }
  }

  async submitAssignment(
    student_id: string,
    assignment_id: string,
    submissionDesc: string
  ) {
    try {
      const student = await this.studentRepo.findOne({
        where: { id: student_id },
      });
      const assignment = await this.assignmentRepo.findOne({
        where: { id: assignment_id },
      });

      if (!student || !assignment) {
        throw new Error("Student or Assignment not found");
      }

      const submission = this.submissionRepo.create({
        submission_desc: submissionDesc,
        assignment: assignment,
      });

      await this.submissionRepo.save(submission);
      return submission;
    } catch (error) {
      throw new Error(error.message || "Failed to submit assignment");
    }
  }
  async studentProfile(student_id: string) {
    console.log("🚀 ~ UniversityService ~ uniProfile ~ uni_id:", student_id);
    try {
      const student = await this.studentRepo.findOneBy({ id: student_id });
      if (!student) throw new Error("student Not found");

      console.log("🚀 ~ UniversityService ~ uniProfile ~ uniProfile:", student);
      return student;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid credentials");
      }
    }
  }

  async updateProfile(
    student_id: string,
    data: StudentInterface,
    studentProfileImage: string
  ) {
    try {
      const student = await this.studentRepo.findOneBy({ id: student_id });
      if (!student) throw new Error("student not found");

      const updateProfile = await this.studentRepo.update(
        {
          id: student_id,
        },
        {
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
          email: data.email,
          profileImagePath: studentProfileImage,
        }
      );
      console.log(
        "🚀 ~ TeacherService ~ updateProfile ~ updateProfile:",
        updateProfile
      );
      const updatedStudent = await this.studentRepo.findOneBy({
        id: student_id,
      });

      return updatedStudent;
    } catch (error) {
      console.log("🚀 ~ updateProfile ~ error:", error);
    }
  }
  async getStudentModules(student_id: string) {
    const student = await this.studentRepo.findOne({
      where: { id: student_id },
      relations: [
        "section",
        "section.moduleSection",
        "section.moduleSection.module",
      ],
    });

    if (!student || !student.section) {
      return [];
    }

    const modules = student.section.moduleSection.map(
      (moduleSection) => moduleSection.module
    );

    return modules;
  }

  async getStudentNotifications(student_id: string) {
    try {
      const student = await this.studentRepo.findOneBy({ id: student_id });
      if (!student) throw new Error("Student not found ");

      const getNotification = await this.notificationRepo.find({
        where: { student: { id: student_id } },
        relations: ["announcement", "resource", "assignment", "routine"],
      });
      return getNotification;
    } catch (error) {
      console.log("🚀 ~ getTeacherNotifications ~ error:", error);
    }
  }

  async markAsRead(notificationId: string) {
    const getNotification = await this.notificationRepo.findOne({
      where: {
        id: notificationId,
      },
    });
    const update = await this.notificationRepo.update(
      {
        id: getNotification.id,
      },
      {
        isRead: true,
      }
    );
    return update;
  }

  async getTodaySchedule(studentId: string): Promise<Routine[]> {
    const student = await this.studentRepo.findOne({
      where: { id: studentId },
      relations: ['section'],
    });
    if (!student) {
      throw new Error (`Student not found`);
    }
    const section = student.section;

    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const todayName = days[new Date().getDay()];

    const todaySchedule = await this.routineRepo.find({
      where: {
        section: { id: section.id },
        day: todayName,
      },
      relations: ['module', 'teacher'],
      order: { startTime: 'ASC' },
    });

    return todaySchedule;
  }
}
export default StudentService;
