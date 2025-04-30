import { University } from "../entities/university/university.entity";
import { AppDataSource } from "../config/database.config";
import { Teacher_Section } from "../entities/TeacherSection/TeacherSection.entity";
import { Teacher_Module } from "../entities/TeacherModule/teacherModule.entity";
import { Student } from "../entities/student/student.entity";
import { Teacher } from "../entities/teacher/teacher.entity";
import { Notification } from "../entities/notification/notification.entity";
import { getSocketIdByUserId } from "../socket/socket";
import { io } from "../socket/socket";
import { ExamRoutineInterface } from "../interface/examRoutine.interface";
import { In } from "typeorm";
import { ExamRoutine } from "../entities/Routine/exam_routine.entity";
import HttpException from "../utils/HttpException.utils";

class ExamRoutineService {
  constructor(
    private readonly examRoutineRepo = AppDataSource.getRepository(ExamRoutine),
    private readonly teacherRepo = AppDataSource.getRepository(Teacher),
    private readonly studentRepo = AppDataSource.getRepository(Student),
    private readonly uniRepo = AppDataSource.getRepository(University),
    private readonly teacherSection = AppDataSource.getRepository(
      Teacher_Section
    ),
    private readonly teacherModule = AppDataSource.getRepository(
      Teacher_Module
    ),
    private readonly notificationRepo = AppDataSource.getRepository(
      Notification
    )
  ) {}
  async createExamRoutine(uni_id: string, data: ExamRoutineInterface) {
    console.log("🚀 ~ RoutineService ~ createRoutine ~ data:", data);

    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const createExamRoutine = await this.examRoutineRepo.create({
        university: uni,
        examDate: data.examDate,
        startTime: data.startTime,
        endTime: data.endTime,
        program: { id: data.program_id },
        module: { id: data.module_id },
      });

      const saveExamRoutine =
        await this.examRoutineRepo.save(createExamRoutine);
      return this.examRoutineRepo.findOneOrFail({
        where: { id: saveExamRoutine.id },
        relations: ["university", "program", "module"],
      });
    } catch (error) {
      console.log("🚀 ~ ExamRoutineService ~ createRoutine ~ error:", error);
    }
  }

  async getExamRoutine(uni_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const getExamRoutine = await this.examRoutineRepo.find({
        where: { university: { id: uni_id } },
        relations: ["university", "program", "module"],
        order: { examDate: "ASC", startTime: "ASC" },
      });
      return getExamRoutine;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid credentials");
      }
    }
  }

  async getExamRoutineByTeacher(teacher_id: string) {
    try {
      const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
      if (!teacher) throw new Error("Teacher not found");

      const teacherModules = await this.teacherModule.find({
        where: { teacher: { id: teacher_id } },
        relations: ["module"],
      });
      const moduleIds = teacherModules.map((tm) => tm.module.id);

      const teacherSections = await this.teacherSection.find({
        where: { teacher: { id: teacher_id } },
        relations: ["section"],
      });
      const sectionIds = teacherSections.map((ts) => ts.section.id);

      let whereClause: any[] = [];
      if (moduleIds.length) whereClause.push({ module: { id: In(moduleIds) } });
      if (sectionIds.length)
        whereClause.push({ section: { id: In(sectionIds) } });
      if (!whereClause.length) return [];

      const examRoutines = await this.examRoutineRepo.find({
        where: whereClause,
        relations: ["university", "program", "module"],
        order: { examDate: "ASC", startTime: "ASC" },
      });

      return examRoutines;
    } catch (error) {
      console.log(
        "🚀 ~ ExamRoutineService ~ getExamRoutineByTeacher ~ error:",
        error
      );
    }
  }

  async getExamRoutineByStudent(student_id: string) {
    const student = await this.studentRepo.findOne({
      where: { id: student_id },
      relations: ["section", "section.program"],
    });
    if (!student) {
      throw new Error(`Student ${student_id} not found`);
    }
    const programId = student.section.program?.id;
    if (!programId) {
      return [];
    }
    try {
      const routines = await this.examRoutineRepo.find({
        where: { program: { id: programId } },
        relations: ["program", "module", "university"],
        order: { examDate: "ASC", startTime: "ASC" },
      });
      return routines;
    } catch (err) {
      throw new Error(`Could not load exam routines: ${err.message}`);
    }
  }

  async updateExamRoutine(uni_id: string, examRoutine_id: string, data: any) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const examRoutine = await this.examRoutineRepo.findOneBy({
        id: examRoutine_id,
      });
      if (!examRoutine) throw new Error("Exam Routine Not found");

      const updateExam = await this.examRoutineRepo.update(
        {
          id: examRoutine_id,
        },
        {
          examDate: data.examDate,
          startTime: data.startTime,
          endTime: data.endTime,
          program: { id: data.program_id },
          module: { id: data.module_id },
        }
      );
      return "Exam routine updated successfully";
    } catch (error) {
      console.error("Error updating exam routine:", error);
      throw new Error("Failed to update exam routine");
    }
  }

  async deleteExamRoutine(uni_id: string, examRoutine_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const examRoutine = await this.examRoutineRepo.findOneBy({
        id: examRoutine_id,
      });
      if (!examRoutine) throw new Error("Exam Routine Not found");

      const deleteRoutine = await this.examRoutineRepo.delete({
        id: examRoutine_id,
      });
      return deleteRoutine;
    } catch (error) {
      console.log("🚀 ~ ExamRoutineService ~ deleteExamRoutine ~ error:", error)
      }
    }
  }

export default new ExamRoutineService();
