import { AppDataSource } from "../config/database.config";
import { UniversityInterface } from "../interface/university.interface";
import { University } from "../entities/university/university.entity";
import BcryptService from "../utils/bcrypt.utils";
import HttpException from "../utils/HttpException.utils";
import { ProgramInterface } from "../interface/program.interface";
import { Program } from "../entities/Programs/program.entity";
import { ModuleInterface } from "../interface/module.interface";
import { Module } from "../entities/module/module.entity";
import { TeacherInterface } from "../interface/teacher.interface";
import { Teacher } from "../entities/teacher/teacher.entity";
import { Student } from "../entities/student/student.entity";
import { DurationType, Gender, NotificationType } from "../constant/enum";
import { Announcement } from "../entities/announcement/announcement.entity";
import { AnnouncementInterface } from "../interface/announcement.interface";
import { Section } from "../entities/Section/section.entity";
import { Teacher_Module } from "../entities/TeacherModule/teacherModule.entity";
import { Teacher_Section } from "../entities/TeacherSection/TeacherSection.entity";
import { Notification } from "../entities/notification/notification.entity";
import { io, getSocketIdByUserId, initializeSocket } from "../socket/socket";
import { Between } from "typeorm";
import { Routine } from "../entities/Routine/routine.entity";
import { UniversitySubscription } from "../entities/UniSubscription/unisubscription.entity";
const bcryptservice = new BcryptService();

class UniversityService {
  constructor(
    private readonly uniRepo = AppDataSource.getRepository(University),
    private readonly progRepo = AppDataSource.getRepository(Program),
    private readonly modRepo = AppDataSource.getRepository(Module),
    private readonly TeachRepo = AppDataSource.getRepository(Teacher),
    private readonly studentRepo = AppDataSource.getRepository(Student),
    private readonly notificationRepo = AppDataSource.getRepository(
      Notification
    ),
    private readonly routineRepo = AppDataSource.getRepository(Routine),
    private readonly uniSubscriptionRepo = AppDataSource.getRepository(
      UniversitySubscription
    ),
    private readonly announcementRepo = AppDataSource.getRepository(
      Announcement
    ),

    private readonly AnnouncementRepo = AppDataSource.getRepository(
      Announcement
    ),
    private readonly sectionRepo = AppDataSource.getRepository(Section),
    private readonly teacher_ModuleRepo = AppDataSource.getRepository(
      Teacher_Module
    ),
    private readonly teacher_SectionRepo = AppDataSource.getRepository(
      Teacher_Section
    )
  ) {}
  async createUniversity(
    data: UniversityInterface,
    universityProfileImage: string
  ) {
    try {
      const emailExist = await this.uniRepo.findOneBy({
        email: data.email,
      });
      if (emailExist) throw new Error("The email is already exists");

      const hashPassword = await bcryptservice.hash(data.password);
      const auth = this.uniRepo.create({
        email: data.email,
        universityName: data.university_name,
        password: hashPassword,
        profileImagePath: universityProfileImage,
      });
      await this.uniRepo.save(auth);
      return auth;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }

  async loginUniversity(data: UniversityInterface) {
    try {
      const universityLogin = await this.uniRepo.findOne({
        where: [{ email: data.email }],
        select: ["id", "email", "password", "role"],
      });

      if (!universityLogin)
        throw HttpException.badRequest("Entered email is not registered yet");
      const isPassword = await bcryptservice.compare(
        data.password,
        universityLogin.password
      );
      if (!isPassword) throw HttpException.badRequest("Incorrect password");
      return universityLogin;
    } catch (error: any) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid credentials");
      }
    }
  }

  async uniProfile(uni_id: string) {
    console.log("🚀 ~ UniversityService ~ uniProfile ~ uni_id:", uni_id);
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      console.log("🚀 ~ UniversityService ~ uniProfile ~ uniProfile:", uni);
      return uni;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid credentials");
      }
    }
  }

  async updateProfile(
    uni_id: string,
    data: any,
    universityProfileImage: string
  ) {
    console.log("🚀 ~ UniversityService ~ updateProfile ~ uni_id:", uni_id);
    console.log("🚀 ~ UniversityService ~ updateProfile ~ data:", data);
    console.log(
      "🚀 ~ UniversityService ~ updateProfile ~ universityProfileImage:",
      universityProfileImage
    );
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");
      console.log("🚀 ~ UniversityService ~ updateProfile ~ uni:", uni);

      const updatePorifle = await this.uniRepo.update(
        {
          id: uni_id,
        },
        {
          email: data.email,
          universityName: data.universityName,
          profileImagePath: universityProfileImage,
        }
      );
      const updatedUni = await this.uniRepo.findOneBy({ id: uni_id });
      console.log(
        "🚀 ~ UniversityService ~ updateProfile ~ updatedUni:",
        updatedUni
      );

      return updatedUni;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid credentials");
      }
    }
  }

  async addProgram(uni_id: string, data: ProgramInterface) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      if (!Object.values(DurationType).includes(data.durationType)) {
        throw new Error("Invalid duration type. Must be 'semester' or 'year'.");
      }

      if (data.duration <= 0) {
        throw new Error("Program duration must be greater than 0.");
      }

      const addProgram = this.progRepo.create({
        name: data.name,
        durationType: data.durationType,
        duration: data.duration,
        university: uni,
      });

      await this.progRepo.save(addProgram);
      return "Program created successfully";
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid request");
      }
    }
  }

  async updateProgam(
    uni_id: string,
    program_id: string,
    data: ProgramInterface
  ) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const program = await this.progRepo.findOneBy({
        id: program_id,
        university: { id: uni_id },
      });
      if (!program) throw new Error("Program Not found");

      const updateProgram = await this.progRepo.update(
        {
          id: program_id,
        },
        {
          name: data.name,
          durationType: data.durationType,
          duration: data.duration,
        }
      );
      return updateProgram;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid credentials");
      }
    }
  }

  async findProgram(uni_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      return await this.progRepo.find({
        where: { university: { id: uni_id } },
        relations: ["university"],
      });
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid credentials");
      }
    }
  }

  async deleteProgram(uni_id: string, program_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("Uni not found");

      const program = await this.progRepo.findOneBy({ id: program_id });
      if (!program) throw new Error("No Program found");

      await this.progRepo.delete({ id: program.id });

      return "Program deleted successfully";
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Program not found");
      }
    }
  }

  async addModule(uni_id: string, prog_id: string, data: ModuleInterface) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      const program = await this.progRepo.findOneBy({ id: prog_id });
      if (!program) throw new Error("Program not found");

      const addModule = this.modRepo.create({
        name: data.name,
        module_code: data.module_code,
        durationReference: data.durationReference,
        university: uni,
        program: program,
      });

      await this.modRepo.save(addModule);
      return addModule;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Module not found");
      }
    }
  }

  async updateModule(uni_id: string, module_id: string, data: any) {
    try {
      const university = await this.uniRepo.findOneBy({ id: uni_id });
      if (!university) throw new Error("University not found");

      const module = await this.modRepo.findOneBy({
        id: module_id,
        university: { id: uni_id },
      });
      if (!module) throw new Error("Module not found");

      const updatedModule = await this.modRepo.update(
        { id: module_id },
        {
          name: data.name,
          module_code: data.module_code,
          durationReference: data.durationReference,
        }
      );

      return updatedModule;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Failed to update module");
      }
    }
  }

  async findModules(uni_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      const modules = await this.modRepo.find({
        where: { university: { id: uni_id } },
        relations: ["program"],
      });
      console.log("🚀 ~ UniversityService ~ findModules ~ modules:", modules);
      if (!module) throw new Error("Module Not found");

      return modules;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unexpected error occurred while fetching modules");
      }
    }
  }

  async findModulesByProgram(uni_id: string, program_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      const program = await this.progRepo.findOneBy({ id: program_id });
      if (!program) throw new Error("Program not found");

      const modules = await this.modRepo.find({
        where: { program: { id: program_id } },
        relations: ["program"],
      });
      console.log("🚀 ~ UniversityService ~ findModules ~ modules:", modules);
      if (!module) throw new Error("Module Not found");

      return modules;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unexpected error occurred while fetching modules");
      }
    }
  }
  async findModulesBySection(uni_id: string, section_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      const program = await this.sectionRepo.findOneBy({ id: section_id });
      if (!program) throw new Error("Section not found");

      const modules = await this.sectionRepo
        .createQueryBuilder("section")
        .leftJoinAndSelect("section.moduleSection", "moduleSection")
        .leftJoinAndSelect("moduleSection.module", "module")
        .where("section.id =:section_id", { section_id })
        .getMany();
      console.log("🚀 ~ UniversityService ~ findModules ~ modules:", modules);
      if (!module) throw new Error("Module Not found");

      return modules;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unexpected error occurred while fetching modules");
      }
    }
  }

  async deleteModule(uni_id: string, module_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      const module = await this.modRepo.findOneBy({ id: module_id });
      if (!module) throw new Error("Module not found");

      await this.modRepo.delete(module_id);
      return "Module deleted successfully";
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Module not found");
      }
    }
  }
  async addTeacher(
    uni_id: string,
    module_id: any[],
    sections_id: any[],
    data: any
  ) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const hashPassword = await bcryptservice.hash(data.password);

      const teacher = this.TeachRepo.create({
        name: data.name,
        email: data.email,
        password: hashPassword,
        gender: data.gender,
        contact: data.contact,
        university: uni,
      });
      await this.TeachRepo.save(teacher);

      await Promise.all(
        module_id.map(async (moduleId) => {
          const module = await this.modRepo.findOneBy({ id: moduleId });
          if (!module) throw new Error(`Module with ID ${moduleId} not found`);

          const teacherModule = this.teacher_ModuleRepo.create({
            teacher,
            module,
          });
          await this.teacher_ModuleRepo.save(teacherModule);
        })
      );
      await Promise.all(
        sections_id.map(async (sectionId) => {
          const section = await this.sectionRepo.findOne({
            where: { id: sectionId },
          });
          if (!section)
            throw new Error(`Section with ID ${sectionId} not found`);

          const teacher_Section = this.teacher_SectionRepo.create({
            teacher,
            section,
          });
          await this.teacher_SectionRepo.save(teacher_Section);
        })
      );
      return "Teacher Created Successfully with modules and sections!";
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Teacher not found");
      }
    }
  }
  async updateTeacher(
    uni_id: string,
    teacher_id: string,
    modules: any[],
    sections: any[],
    data: TeacherInterface
  ) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      const teacher = await this.TeachRepo.findOne({
        where: { id: teacher_id },
        relations: ["university", "teacher_module"],
      });
      if (!teacher) throw new Error("Teacher not found");
      if (teacher.university.id !== uni_id)
        throw new Error("Teacher does not belong to specified university");

      const updateFields: Partial<Teacher> = {};
      if (data.name !== undefined) updateFields.name = data.name;
      if (data.email !== undefined) updateFields.email = data.email;
      if (data.gender !== undefined) updateFields.gender = data.gender;
      if (data.contact !== undefined) updateFields.contact = data.contact;
      if (data.password !== undefined) {
        updateFields.password = await bcryptservice.hash(data.password);
      }

      if (Object.keys(updateFields).length > 0) {
        await this.TeachRepo.update({ id: teacher_id }, updateFields);
      }

      const existingTeacherModules = await this.teacher_ModuleRepo.find({
        where: { teacher: { id: teacher_id } },
        relations: ["module"],
      });

      const existingModuleIds = new Set(
        existingTeacherModules
          .map((tm) => tm.module?.id)
          .filter((id): id is string => Boolean(id))
      );

      const newModuleIds = new Set(modules);

      for (const relation of existingTeacherModules) {
        if (relation.module?.id && !newModuleIds.has(relation.module.id)) {
          await this.teacher_ModuleRepo.delete({
            teacher: { id: teacher_id },
            module: { id: relation.module.id },
          });
        }
      }

      for (const moduleId of modules) {
        if (!existingModuleIds.has(moduleId)) {
          console.log("🚀 ~ UniversityService ~ moduleId:", moduleId);
          const module = await this.modRepo.findOneBy({ id: moduleId });
          if (!module) throw new Error(`Module with ID ${moduleId} not found`);

          const existingRelation = await this.teacher_ModuleRepo.findOne({
            where: { teacher: { id: teacher_id }, module: { id: moduleId } },
          });

          if (!existingRelation) {
            const newRelation = this.teacher_ModuleRepo.create({
              teacher,
              module: { id: moduleId },
            });
            await this.teacher_ModuleRepo.save(newRelation);
          }
        }
      }

      const existingTeacherSections = await this.teacher_SectionRepo.find({
        where: { teacher: { id: teacher_id } },
        relations: ["section"],
      });

      const existingSectionIds = new Set(
        existingTeacherSections
          .map((ts) => ts.section?.id)
          .filter((id): id is string => Boolean(id))
      );

      const newSectionIds = new Set(sections);

      for (const relation of existingTeacherSections) {
        if (relation.section?.id && !newSectionIds.has(relation.section.id)) {
          await this.teacher_SectionRepo.delete({
            teacher: { id: teacher_id },
            section: { id: relation.section.id },
          });
        }
      }

      for (const sectionId of sections) {
        if (!existingSectionIds.has(sectionId)) {
          const section = await this.sectionRepo.findOneBy({ id: sectionId });
          if (!section)
            throw new Error(`Section with ID ${sectionId} not found`);

          const existingRelation = await this.teacher_SectionRepo.findOne({
            where: { teacher: { id: teacher_id }, section: { id: sectionId } },
          });

          if (!existingRelation) {
            const newRelation = this.teacher_SectionRepo.create({
              teacher,
              section: { id: sectionId },
            });
            await this.teacher_SectionRepo.save(newRelation);
          }
        }
      }

      return "Teacher updated successfully with modules and sections!";
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Teacher update failed");
    }
  }

  async getModuleByDuration(uni_id: string, prog_id: string, duration: number) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");
      const program = await this.progRepo.findOneBy({ id: prog_id });
      if (!program) throw new Error("Program Not found");

      const modules = await this.modRepo.find({
        where: { program: { id: prog_id }, durationReference: duration },
        relations: ["program"],
      });
      console.log(
        "🚀 ~ UniversityService ~ getModuleByDuration ~ modules:",
        modules
      );

      return modules;
    } catch (error) {
      console.log(
        "🚀 ~ UniversityService ~ getModuleByDuration ~ error:",
        error
      );
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async getTeachers(uni_id: string) {
    try {
      const university = await this.uniRepo.findOneBy({ id: uni_id });
      if (!university) throw new Error("University not found");

      const teachers = await this.TeachRepo.createQueryBuilder("teacher")
        .leftJoinAndSelect("teacher.teacher_module", "teacher_module")
        .leftJoinAndSelect("teacher_module.module", "module")
        .leftJoinAndSelect("module.program", "program")
        .leftJoinAndSelect("teacher.teacher_section", "teacher_section")
        .leftJoinAndSelect("teacher_section.section", "section")
        .where("teacher.uni_id = :uni_id", { uni_id })
        .getMany();

      if (!teachers.length) throw new Error("No teachers found");
      return teachers;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch teachers"
      );
    }
  }
  async getTeachersByModule(uni_id: string, module_id: string) {
    try {
      const university = await this.uniRepo.findOneBy({ id: uni_id });
      if (!university) {
        throw new Error("University not found");
      }

      const module = await this.modRepo.findOneBy({ id: module_id });
      if (!module) {
        throw new Error("Module not found");
      }

      const teachers = await this.TeachRepo.find({
        where: {
          teacher_module: {
            module: { id: module_id },
          },
        },
        relations: ["teacher_module", "teacher_module.module"],
      });

      if (!teachers.length) {
        throw new Error("No teachers found for this module");
      }

      return teachers;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch teachers"
      );
    }
  }

  async addTeacherBySection(data: any) {
    try {
      const section = this.teacher_SectionRepo.create({
        section: { id: data.sectionId },
        teacher: { id: data.teacherId },
      });
      const saved = await this.teacher_SectionRepo.save(section);
      const module = this.teacher_ModuleRepo.create({
        teacher: { id: data.teacherId },
        module: { id: data.moduleId },
      });
      await this.teacher_ModuleRepo.save(module);
      return saved;
    } catch (error) {
      console.log(
        "🚀 ~ UniversityService ~ addTeacherBySection ~ error:",
        error
      );
    }
  }
  async getTeacherById(uni_id: string, teacherId: string) {
    try {
      const university = await this.uniRepo.findOneBy({ id: uni_id });
      if (!university) throw new Error("University not found");

      const teacher = await this.TeachRepo.findOne({
        where: { id: teacherId, university: { id: uni_id } },
      });

      if (!teacher) throw new Error("Teacher not found");

      return teacher;
    } catch (error: any) {
      throw new Error(error.message || "Failed to get teacher");
    }
  }

  async deleteTeacher(
    uni_id: string,
    teacher_id: string,
    module_id: any[],
    sections_id: any[]
  ) {
    try {
      const university = await this.uniRepo.findOneBy({ id: uni_id });
      if (!university) throw new Error("University not found");

      const teacher = await this.TeachRepo.findOne({
        where: { id: teacher_id, university: { id: uni_id } },
        relations: ["university", "teacher_module", "teacher_section"],
      });
      if (!teacher) {
        throw new Error(
          "Teacher not found or does not belong to the university"
        );
      }

      // Handle module removals
      if (module_id && module_id.length > 0) {
        await Promise.all(
          module_id.map(async (moduleId) => {
            const module = await this.modRepo.findOneBy({ id: moduleId });
            if (!module)
              throw new Error(`Module with ID ${moduleId} not found`);

            const association = await this.teacher_ModuleRepo.findOne({
              where: {
                teacher: { id: teacher_id },
                module: { id: moduleId },
              },
            });

            if (!association) {
              throw new Error(
                `Teacher is not associated with module ${moduleId}`
              );
            }

            await this.teacher_ModuleRepo.remove(association);
          })
        );
      }

      // Handle section removals
      if (sections_id && sections_id.length > 0) {
        await Promise.all(
          sections_id.map(async (sectionId) => {
            const section = await this.sectionRepo.findOneBy({ id: sectionId });
            if (!section)
              throw new Error(`Section with ID ${sectionId} not found`);

            const association = await this.teacher_SectionRepo.findOne({
              where: {
                teacher: { id: teacher_id },
                section: { id: sectionId },
              },
            });

            if (!association) {
              throw new Error(
                `Teacher is not associated with section ${sectionId}`
              );
            }

            await this.teacher_SectionRepo.remove(association);
          })
        );
      }
      const remainingModules = await this.teacher_ModuleRepo.count({
        where: { teacher: { id: teacher_id } },
      });
      const remainingSections = await this.teacher_SectionRepo.count({
        where: { teacher: { id: teacher_id } },
      });

      if (remainingModules === 0 && remainingSections === 0) {
        await this.TeachRepo.delete(teacher_id);
        return { success: true, message: "Teacher deleted successfully" };
      }

      return {
        success: true,
        message: "Teacher associations removed but record kept",
      };
    } catch (error: any) {
      console.error("Error:", error.message);
      throw new Error(
        error.message || "An error occurred while removing the teacher"
      );
    }
  }

  async addStudent(uni_id: string, data: any) {
    console.log("🚀 ~ UniversityService ~ addStudent ~ data:", data);
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const section = await this.sectionRepo.findOneBy({ id: data.section_id });
      if (!section) throw new Error("Section Not found");

      const hashPassword = await bcryptservice.hash(data.password);

      // Create and save the teacher
      const student = this.studentRepo.create({
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        DOB: data.DOB,
        gender: data.gender,
        admissionYear: data.admissionYear,
        email: data.email,
        password: hashPassword,
        uni: uni,
        section: {
          id: data.section_id,
        },
      });
      console.log("🚀 ~ UniversityService ~ addStudent ~ student:", student);

      await this.studentRepo.save(student);

      return student;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async getStudent(uni_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const students = await this.studentRepo.find({
        where: { uni: { id: uni_id } },
        relations: ["section"],
      });

      return students;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async editStudent(uni_id: string, student_id: string, data: any) {
    const uni = await this.uniRepo.findOneBy({ id: uni_id });
    if (!uni) throw new Error("University Not found");

    const student = await this.studentRepo.findOneBy({ id: student_id });
    if (!student) throw new Error("Student Not found");

    const hashPassword = await bcryptservice.hash(data.password);

    const updateStudent = await this.studentRepo.update(
      { id: student_id },
      {
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        DOB: data.DOB,
        gender: data.gender,
        admissionYear: data.admissionYear,
        email: data.email,
        password: hashPassword,
        uni: uni,
        section: data.section_id,
      }
    );

    return updateStudent;
  }

  async deleteStudent(uni_id: string, student_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const student = await this.studentRepo.findOne({
        where: { id: student_id, uni: { id: uni_id } },
      });
      if (!student) throw HttpException.notFound("Student not found");
      await this.studentRepo.delete({ id: student.id });

      return "Student deleted successfully";
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async postAnnouncement(uni_id: string, data: AnnouncementInterface) {
    try {
      // Find the university by ID
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      // Create and save the announcement
      const createAnnouncement = this.AnnouncementRepo.create({
        announce_name: data.announce_name,
        announce_title: data.announce_title,
        announce_date: data.announce_date,
        university: uni,
      });
      const savedAnnouncement =
        await this.AnnouncementRepo.save(createAnnouncement);

      // Find teachers and students associated with the university
      const teachers = await this.TeachRepo.find({
        where: {
          university: { id: uni_id },
        },
      });
      const students = await this.studentRepo.find({
        where: {
          uni: { id: uni_id },
        },
      });

      const teacherNotifications = teachers.map((teacher) =>
        this.notificationRepo.create({
          message: savedAnnouncement.announce_title,
          type: NotificationType.ANNOUNCEMENT,
          university: uni,
          teacher: teacher,
          announcement: savedAnnouncement,
        })
      );

      const studentNotifications = students.map((student) =>
        this.notificationRepo.create({
          message: savedAnnouncement.announce_title,
          type: NotificationType.ANNOUNCEMENT,
          university: uni,
          student: student,
          announcement: savedAnnouncement,
        })
      );

      // Save all notifications to the database first
      const notificationsToSave = [
        ...teacherNotifications,
        ...studentNotifications,
      ];
      const savedNotifications =
        await this.notificationRepo.save(notificationsToSave);

      // After saving, iterate over saved notifications and emit through the socket
      savedNotifications.forEach(async (notification) => {
        // Retrieve detailed notification with relations for consistency
        const detailedNotification = await this.notificationRepo.findOne({
          where: { id: notification.id },
          relations: ["announcement", "university"],
        });
        console.log(
          "🚀 ~ UniversityService ~ savedNotifications.forEach ~ detailedNotification:",
          detailedNotification
        );

        // Determine whether this is a teacher or a student notification
        if (notification.teacher) {
          const socket_id = await getSocketIdByUserId(notification.teacher.id);
          if (socket_id && detailedNotification) {
            io.to(socket_id).emit("new-announcement", {
              notification: detailedNotification,
            });
          }
        } else if (notification.student) {
          const socket_id = await getSocketIdByUserId(notification.student.id);
          if (socket_id && detailedNotification) {
            io.to(socket_id).emit("new-announcement", {
              notification: detailedNotification,
            });
          }
        }
      });

      return savedAnnouncement;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid data");
      }
    }
  }

  async getAnnouncement(uni_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      const getAnnouncement = await this.AnnouncementRepo.find({
        where: { university: { id: uni_id } },
        relations: ["university"],
      });
      return getAnnouncement;
    } catch (error) {
      throw HttpException.badRequest("Failed to fetch announcements");
    }
  }
  async updateAnnouncement(
    uni_id: string,
    announcement_id: string,
    data: AnnouncementInterface
  ) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const announcement = await this.AnnouncementRepo.findOneBy({
        id: announcement_id,
        university: { id: uni_id },
      });
      if (!announcement) throw new Error("Announcement Not found");

      const updateAnnouncement = await this.AnnouncementRepo.update(
        {
          id: announcement_id,
        },
        {
          announce_name: data.announce_name,
          announce_title: data.announce_title,
          announce_date: data.announce_date,
        }
      );
      return updateAnnouncement;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid credentials");
      }
    }
  }

  async deleteAnnouncement(uni_id: string, announcement_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("Uni not found");

      const announcement = await this.AnnouncementRepo.findOneBy({
        id: announcement_id,
      });
      if (!announcement) throw new Error("No any Announcement found");

      await this.AnnouncementRepo.delete({ id: announcement.id });

      return "Announcement deleted successfully";
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Announcement not found");
      }
    }
  }

  async getTotalStudent(uni_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const totalStudent = await this.studentRepo.count({
        where: { uni: { id: uni_id } },
      });

      return totalStudent;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async getTotalTeacher(uni_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const totalTeacher = await this.TeachRepo.count({
        where: { university: { id: uni_id } },
      });

      return totalTeacher;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async getTotalProgram(uni_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const totalProgram = await this.progRepo.count({
        where: { university: { id: uni_id } },
      });

      return totalProgram;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async getTeacherStudentRatioByProgram(uni_id: string) {
    try {
      const university = await this.uniRepo.findOneBy({ id: uni_id });
      if (!university) throw new Error("University not found");

      const programs = await this.progRepo.find({
        where: { university: { id: uni_id } },
        relations: [
          "sections",
          "sections.students",
          "sections.teacher_Section",
        ],
      });

      const result = programs.map((prog) => {
        let studentCount = 0;
        let teacherCount = 0;

        prog.sections.forEach((section) => {
          studentCount += section.students ? section.students.length : 0;
          teacherCount += section.teacher_Section
            ? section.teacher_Section.length
            : 0;
        });

        return {
          programName: prog.name,
          studentCount,
          teacherCount,
          ratio:
            teacherCount > 0 ? (studentCount / teacherCount).toFixed(2) : "N/A",
        };
      });

      return result;
    } catch (error) {
      console.log("🚀 ~ getTeacherStudentRatioByProgram ~ error:", error);
      throw error;
    }
  }

  async getTeacherClassesBySectionForCurrentDate(uni_id: string) {
    try {
      const today = new Date();
      const weekday = today.toLocaleDateString("en-US", { weekday: "long" });

      const university = await this.uniRepo.findOneBy({ id: uni_id });
      if (!university) throw new Error("University not found");

      const routines = await this.routineRepo.find({
        where: {
          teacher: { university: { id: uni_id } },
          day: weekday,
        },
        relations: ["teacher", "section"],
      });

      const result = routines.map((routine) => ({
        teacherName: routine.teacher.name,
        sectionName: routine.section.name,
        classTime: `${routine.startTime} - ${routine.endTime}`,
      }));

      return result;
    } catch (error) {
      console.log("Error fetching teacher classes for current date:", error);
      throw error;
    }
  }

  async getTodayAnnouncements(uni_id: string) {
    try {
      const university = await this.uniRepo.findOneBy({ id: uni_id });
      if (!university) throw new Error("University not found");

      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      const announcements = await this.announcementRepo.find({
        where: {
          university: { id: uni_id },
          announce_date: Between(startOfDay, endOfDay),
        },
        relations: ["teacher", "module"],
      });

      return announcements;
    } catch (error) {
      console.error("Error fetching today's announcements:", error);
      throw error;
    }
  }

  async getSubscriptionByUni(uni_id: string) {
    try {
      const subscriptions = await this.uniSubscriptionRepo.find({
        where: {
          university: { id: uni_id },
        },
        relations: ["subscription", "university"],
      });
  
      if (!subscriptions || subscriptions.length === 0) {
        throw new Error("No subscriptions found for the given university");
      }
  
      return subscriptions;
    } catch (error) {
    console.log("🚀 ~ UniversityService ~ getSubscriptionByUni ~ error:", error)
    }
  }
}

export default new UniversityService();
