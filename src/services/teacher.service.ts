import { University } from "../entities/university/university.entity";
import { AppDataSource } from "../config/database.config";
import { Resource } from "../entities/resources/resource.entity";
import { Module } from "../entities/module/module.entity";
import { Teacher } from "../entities/teacher/teacher.entity";
import { TeacherInterface } from "../interface/teacher.interface";
import { AnnouncementInterface } from "../interface/announcement.interface";
import { Announcement } from "../entities/announcement/announcement.entity";
import { StringMappingType } from "typescript";
import { Auth } from "typeorm";
import BcryptService from "../utils/bcrypt.utils";
import HttpException from "../utils/HttpException.utils";
import { error } from "console";
import { AssignmentInterface } from "../interface/assignment.interface";
import { Assignment } from "../entities/Assignment/assignment.entity";
import { Teacher_Module } from "../entities/TeacherModule/teacherModule.entity";
import { Teacher_Section } from "../entities/TeacherSection/TeacherSection.entity";

const bcryptService = new BcryptService();

class TeacherService {
  constructor(
    private readonly uniRepo = AppDataSource.getRepository(University),
    private readonly teacher_moduleRepo = AppDataSource.getRepository(
      Teacher_Module
    ),
    private readonly moduleRepo = AppDataSource.getRepository(Module),
    private readonly teacherRepo = AppDataSource.getRepository(Teacher),
    private readonly resourceRepo = AppDataSource.getRepository(Resource),
    private readonly announceRepo = AppDataSource.getRepository(Announcement),
    private readonly assignmentRepo = AppDataSource.getRepository(Assignment),
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

  async addResource(
    data: any,
    TeacherResourceFile: string,
    teacher_id: string
  ) {
    // Validate teacher is assigned to the section
    const teacherSection = await this.teacher_sectionRepo.findOne({
      where: {
        teacher: { id: teacher_id },
        section: { id: data.section_id },
      },
    });
    if (!teacherSection) {
      throw new Error("Teacher is not assigned to this section");
    }

    // Proceed to create resource
    const addResource = this.resourceRepo.create({
      title: data.title,
      module: { id: data.module_id },
      section: { id: data.section_id },
      teacher: { id: teacher_id },
      resourcePath: TeacherResourceFile,
    });
    await this.resourceRepo.save(addResource);
    return addResource;
  }

  async getResource(teacher_id: string, module_id: string) {
    const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
    if (!teacher) throw new Error("Teacher Not Found");

    const module = await this.moduleRepo.findOneBy({ id: module_id });
    if (!module) throw new Error("Module Not Found");

    return await this.resourceRepo.find({
      where: { teacher: { id: teacher_id }, module: { id: module_id } },
      relations: ["teacher", "module"],
    });
  }

  async deleteResource(teacher_id: string, resource_id) {
    const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
    if (!teacher) throw new Error("Teacher Not Found");

    const resource = await this.resourceRepo.findOneBy({ id: resource_id });
    if (!resource) throw new Error("Resource not found");

    await this.resourceRepo.delete({ id: resource_id });
    return "Resource deleted successfully";
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

  // async createAnnouncement(
  //   teacher_id: string,
  //   module_id: string,
  //   data: AnnouncementInterface
  // ) {
  //   try {
  //     const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
  //     if (!teacher) throw new Error("Teacher Not found");

  //     const module = await this.moduleRepo.findOneBy({ id: module_id });
  //     if (!module) throw new Error("Module not found");

  //     const announcement = this.announceRepo.create({
  //       announce_name: data.announce_name,
  //       announce_title: data.announce_title,
  //       announce_date: data.announce_date,
  //       teacher: teacher,
  //       module: module,
  //     });

  //     await this.announceRepo.save(announcement);
  //     return announcement;
  //   } catch (error) {
  //     throw new Error(error.message || "Failed to create announcement");
  //   }
  // }
  // async getAnnouncement(announcement_id: string) {
  //   try {
  //     const announcement = await this.announceRepo.findOne({
  //       where: { id: announcement_id },
  //       relations: ["teacher", "module"],
  //     });

  //     if (!announcement) {
  //       throw new Error("Announcement not found");
  //     }

  //     return announcement;
  //   } catch (error) {
  //     throw new Error(error.message || "Failed to retrieve announcement");
  //   }
  // }

  // async updateAnnouncement(
  //   id: string,
  //   teacher_id: string,
  //   module_id: string,
  //   data: AnnouncementInterface
  // ) {
  //   try {
  //     const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
  //     const module = await this.moduleRepo.findOneBy({ id: module_id });
  //     const announcement = await this.announceRepo.findOneBy({ id });

  //     if (!announcement) {
  //       throw new Error("Announcement not found");
  //     }

  //     announcement.announce_name = data.announce_name;
  //     announcement.announce_title = data.announce_title;
  //     announcement.announce_date = data.announce_date;
  //     announcement.teacher = teacher;
  //     announcement.module = module;

  //     await this.announceRepo.save(announcement);
  //     return announcement;
  //   } catch (error) {
  //     throw new Error(error.message || "Failed to update announcement");
  //   }
  // }

  // async deleteAnnouncement(id: string) {
  //   try {
  //     const announcement = await this.announceRepo.findOneBy({ id });

  //     if (!announcement) {
  //       throw new Error("Announcement not found");
  //     }

  //     await this.announceRepo.remove(announcement);
  //     return { message: "Announcement deleted successfully" };
  //   } catch (error) {
  //     throw new Error(error.message || "Failed to delete announcement");
  //   }
  // }

  // async createAssignment(
  //   teacher_id: string,
  //   module_id: string,
  //   data: AssignmentInterface
  // ) {
  //   try {
  //     const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
  //     const module = await this.moduleRepo.findOneBy({ id: module_id });

  //     const assignment = this.assignmentRepo.create({
  //       title: data.title,
  //       description: data.description,
  //       due_date: data.due_Date,
  //       teacher: teacher,
  //       module: module,
  //     });

  //     await this.assignmentRepo.save(assignment);
  //     return assignment;
  //   } catch (error) {
  //     throw new Error(error.message || "Failed to create assignment");
  //   }
  // }
  // async updateAssignment(
  //   teacher_id: string,
  //   assigment_id: string,
  //   data: AssignmentInterface
  // ) {
  //   try {
  //     const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
  //     if (!teacher) throw new Error("You are not authorized");

  //     const assignment = await this.assignmentRepo.findOneBy({
  //       id: assigment_id,
  //       teacher: { id: teacher_id },
  //     });
  //     if (!assignment) throw new Error("Assignment not found");
  //     const assignments = this.assignmentRepo.update(
  //       { id: assigment_id },
  //       {
  //         title: data.title,
  //         description: data.description,
  //         due_date: data.due_Date,
  //       }
  //     );
  //     return assignments;
  //   } catch (error) {
  //     throw new Error(error.message || "Failed to create assignment");
  //   }
  // }
}

export default TeacherService;
