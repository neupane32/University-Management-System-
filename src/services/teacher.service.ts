import { AppDataSource } from "../config/database.config";
import { Module } from "../entities/module/module.entity";
import { Teacher } from "../entities/teacher/teacher.entity";
import { TeacherInterface } from "../interface/teacher.interface";
import BcryptService from "../utils/bcrypt.utils";
import HttpException from "../utils/HttpException.utils";
import { Teacher_Module } from "../entities/TeacherModule/teacherModule.entity";
import { Teacher_Section } from "../entities/TeacherSection/TeacherSection.entity";

const bcryptService = new BcryptService();

class TeacherService {
  constructor(
    private readonly teacher_moduleRepo = AppDataSource.getRepository(Teacher_Module),
    private readonly moduleRepo = AppDataSource.getRepository(Module),
    private readonly teacherRepo = AppDataSource.getRepository(Teacher),
    private readonly teacher_sectionRepo = AppDataSource.getRepository(Teacher_Section),
  ) {}

  async loginTeacher(data: TeacherInterface): Promise<Teacher> {
    try {
      const teacher = await this.teacherRepo.findOne({
        where: [{ email: data.email }],
        select: ["id", "email", "password", "role"],
      });

      if (!teacher)
        throw HttpException.badRequest("Entered email is not registered yet");
      const isPassword = await bcryptService.compare(
        data.password,
        teacher.password
      );
      if (!isPassword) throw HttpException.badRequest("Incorrect password");

      return await this.getTeacherById(teacher.id);
    } catch (error) {
      console.log("🚀 ~ TeacherService ~ loginTeacher ~ error:", error);
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid credentials");
      }
    }
  }
  async getTeacherSections(teacher_id: string) {
    if (!teacher_id) {
      throw HttpException.notFound("Teacher is not registered yet");
    }
  
    const getTeacherSection = await this.teacherRepo.createQueryBuilder("teacher")
      .leftJoinAndSelect("teacher.teacher_section", "teacherSection")
      .leftJoinAndSelect("teacherSection.section", "section")
      .leftJoinAndSelect("teacher.teacher_module", "teacherModule")
      .leftJoinAndSelect("teacherModule.module", "module")
      .where("teacher.id = :teacher_id", { teacher_id })
      .getMany();
  
    return getTeacherSection;
  }
  async getTeacherById(id: string): Promise<Teacher> {
    try {
      const query = this.teacherRepo
        .createQueryBuilder("uni")
        .where("uni.id = :id", { id });

      const teach = await query.getOne();
      if (!teach) throw new Error("Teacher not found");
      return teach;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("User not found");
      }
    }
  }

  async getModulesByTeacher(teacher_id: string) {
    console.log(
      "🚀 ~ TeacherService ~ getModulesByTeacher ~ teacher_id:",
      teacher_id
    );
    try {
      const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
      if (!teacher) throw HttpException.notFound("not found");
      console.log(
        "🚀 ~ TeacherService ~ getModulesByTeacher ~ teacher:",
        teacher
      );

      const modules = await this.teacher_moduleRepo
        .createQueryBuilder("teacher_module")
        .leftJoinAndSelect("teacher_module.module", "module")
        .where("teacher_module.teacher_id = :teacher_id", { teacher_id })
        .getMany();

      console.log(
        "🚀 ~ TeacherService ~ getModulesByTeacher ~ modules:",
        modules
      );
      if (!modules.length) {
        throw new Error("No modules found for this teacher");
      }

      return modules;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch modules"
      );
    }
  }

  async getSectionsByModule(teacherId: string, moduleId: string) {
    try {
      const sections = await this.teacher_sectionRepo
        .createQueryBuilder("ts")
        .leftJoinAndSelect("ts.section", "section")
        .leftJoinAndSelect("section.moduleSection", "moduleSection")
        .leftJoinAndSelect("moduleSection.module", "module")
        .where("ts.teacher_id = :teacherId", { teacherId })
        .andWhere("module.id = :moduleId", { moduleId })
        .getMany();
  
      return sections.map(ts => ts.section);
    } catch (error) {
      throw new Error('Failed to fetch sections');
    }
  }
}

export default TeacherService;
