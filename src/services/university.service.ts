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
import { Resource } from "../entities/resources/resource.entity";
import { StudentInterface } from "../interface/student.interface";
import { Student } from "../entities/student/student.entity";
import { StudentDetails } from "../entities/student/studentDetails.entity";
import { DurationType, Gender} from "../constant/enum";
import { Announcement } from "../entities/announcement/announcement.entity";
import { AnnouncementInterface } from "../interface/announcement.interface";
import { Section } from "../entities/Section/section.entity";
import { Teacher_Module } from "../entities/TeacherModule/teacherModule.entity";
import { Teacher_Section } from "../entities/TeacherSection/TeacherSection.entity";

const bcryptservice = new BcryptService();

class UniversityService {
  constructor(
    private readonly uniRepo = AppDataSource.getRepository(University),
    private readonly progRepo = AppDataSource.getRepository(Program),
    private readonly modRepo = AppDataSource.getRepository(Module),
    private readonly TeachRepo = AppDataSource.getRepository(Teacher),
    private readonly studentRepo = AppDataSource.getRepository(Student),
    private readonly studentDetailsRepo = AppDataSource.getRepository(StudentDetails),
    private readonly AnnouncementRepo = AppDataSource.getRepository(Announcement),
    private readonly sectionRepo = AppDataSource.getRepository(Section),
    private readonly teacher_ModuleRepo = AppDataSource.getRepository(Teacher_Module),
    private readonly teacher_SectionRepo = AppDataSource.getRepository(Teacher_Section),
  ) {}
  async createUniversity(data: UniversityInterface,universityProfileImage:string) {
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
        profileImagePath: universityProfileImage
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
    console.log("🚀 ~ UniversityService ~ uniProfile ~ uni_id:", uni_id)
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

    
      console.log("🚀 ~ UniversityService ~ uniProfile ~ uniProfile:", uni)
      return uni;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid credentials");
      }
    }
  }

  async updateProfile(uni_id: string, data: UniversityInterface, universityProfileImage:string) {
    console.log("🚀 ~ UniversityService ~ updateProfile ~ uni_id:", uni_id)
    console.log("🚀 ~ UniversityService ~ updateProfile ~ data:", data)
    console.log("🚀 ~ UniversityService ~ updateProfile ~ universityProfileImage:", universityProfileImage)
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");
      console.log("🚀 ~ UniversityService ~ updateProfile ~ uni:", uni)

      const updatePorifle = await this.uniRepo.update(
        {
          id: uni_id,
        },
        {
          email: data.email,
          universityName: data.university_name,
          profileImagePath: universityProfileImage
        }
      );
      const updatedUni = await this.uniRepo.findOneBy({ id: uni_id });
      console.log("🚀 ~ UniversityService ~ updateProfile ~ updatedUni:", updatedUni)

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

  async updateProgam(uni_id: string, program_id: string, data: ProgramInterface ) {
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
        relations: ["university"]
      })

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

  async updateModule(
    uni_id: string,
    module_id: string,
    data: any
  ) {
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
        where: { university:{id:uni_id} },
        relations: ["program"],
      });
      console.log("🚀 ~ UniversityService ~ findModules ~ modules:", modules)
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
        where: { program:{id:program_id} },
        relations: ["program"],
      });
      console.log("🚀 ~ UniversityService ~ findModules ~ modules:", modules)
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
  async addTeacher(uni_id: string, module_id: any[], sections_id: any[], data: any) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");
  
      const hashPassword = await bcryptservice.hash(data.password);
  
      // Create and save the teacher
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
          const module = await this.modRepo.findOne({
            where: { id: moduleId },
            relations: ["program"],
          });
          if (!module) throw new Error(`Module with ID ${moduleId} not found`);
  
          const teacher_Module = this.teacher_ModuleRepo.create({
            teacher,
            module,
          });
          await this.teacher_ModuleRepo.save(teacher_Module);
        })
      );

      await Promise.all(
        sections_id.map(async (sectionId) => {
          const section = await this.sectionRepo.findOne({
            where: { id: sectionId }
          });
          if (!section) throw new Error(`Section with ID ${sectionId} not found`);
  
          const teacher_Section = this.teacher_SectionRepo.create({
            teacher,
            section
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
        relations: ["university", "teacher_module"]
      });
      if (!teacher) throw new Error("Teacher not found");
      if (teacher.university.id !== uni_id) throw new Error("Teacher does not belong to specified university");
  
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
  
      // Handle module updates
      const existingTeacherModules = await this.teacher_ModuleRepo.find({
        where: { teacher: { id: teacher_id } },
        relations: ["module"]
      });
  
      const existingModuleIds = new Set(
        existingTeacherModules
          .map((tm) => tm.module?.id)
          .filter((id): id is string => Boolean(id))
      );
  
      const newModuleIds = new Set(modules);
  
      // Remove outdated modules
      for (const relation of existingTeacherModules) {
        if (relation.module?.id && !newModuleIds.has(relation.module.id)) {
          await this.teacher_ModuleRepo.delete({
            teacher: { id: teacher_id },
            module: { id: relation.module.id }
          });
        }
      }
  
      // Add new modules
      for (const moduleId of modules) {
        if (!existingModuleIds.has(moduleId)) {
          const module = await this.modRepo.findOneBy({ id: moduleId });
          if (!module) throw new Error(`Module with ID ${moduleId} not found`);
  
          const existingRelation = await this.teacher_ModuleRepo.findOne({
            where: { teacher: { id: teacher_id }, module: { id: moduleId } }
          });
  
          if (!existingRelation) {
            const newRelation = this.teacher_ModuleRepo.create({
              teacher,
              module: { id: moduleId }
            });
            await this.teacher_ModuleRepo.save(newRelation);
          }
        }
      }
      // Handle section updates
      const existingTeacherSections = await this.teacher_SectionRepo.find({
        where: { teacher: { id: teacher_id } },
        relations: ["section"]
      });
  
      const existingSectionIds = new Set(
        existingTeacherSections
          .map((ts) => ts.section?.id)
          .filter((id): id is string => Boolean(id))
      );
  
      const newSectionIds = new Set(sections);
  
      // Remove outdated sections
      for (const relation of existingTeacherSections) {
        if (relation.section?.id && !newSectionIds.has(relation.section.id)) {
          await this.teacher_SectionRepo.delete({
            teacher: { id: teacher_id },
            section: { id: relation.section.id }
          });
        }
      }
  
      // Add new sections
      for (const sectionId of sections) {
        if (!existingSectionIds.has(sectionId)) {
          const section = await this.sectionRepo.findOneBy({ id: sectionId });
          if (!section) throw new Error(`Section with ID ${sectionId} not found`);
  
          const existingRelation = await this.teacher_SectionRepo.findOne({
            where: { teacher: { id: teacher_id }, section: { id: sectionId } }
          });
  
          if (!existingRelation) {
            const newRelation = this.teacher_SectionRepo.create({
              teacher,
              section: { id: sectionId }
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

  async getModuleByDuration(uni_id: string,prog_id:string, duration:number) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");
      const program = await this.progRepo.findOneBy({ id: prog_id });
      if (!program) throw new Error("Program Not found");

      const modules = await this.modRepo.find({
        where: {program:{id:prog_id}, durationReference:duration },
        relations: ["program"],
      });
      console.log("🚀 ~ UniversityService ~ getModuleByDuration ~ modules:", modules)

      return modules;
    } catch (error) {
      console.log("🚀 ~ UniversityService ~ getModuleByDuration ~ error:", error)
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
 
  async getTeachers(uni_id: string) {
    try {
      const university = await this.uniRepo.findOneBy({ id: uni_id });
      if (!university) throw new Error("University not found");
  
      const teachers = await this.TeachRepo.createQueryBuilder('teacher')
        .leftJoinAndSelect('teacher.teacher_module', 'teacher_module')
        .leftJoinAndSelect('teacher_module.module', 'module')
        .leftJoinAndSelect('module.program', 'program')
        .leftJoinAndSelect('teacher.teacher_section', 'teacher_section')
        .leftJoinAndSelect('teacher_section.section', 'section')
        .where('teacher.uni_id = :uni_id', { uni_id })
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
      if (!university) { throw new Error("University not found"); }
  
      const module = await this.modRepo.findOneBy({ id: module_id });
      if (!module) { throw new Error("Module not found"); }
  
      const teachers = await this.TeachRepo.find({
        where: {
          teacher_module: {
            module: { id: module_id }
          }
        },
        relations: ["teacher_module", "teacher_module.module"]
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

  async deleteTeacher(uni_id: string, teacher_id: string, module_id: any[], sections_id: any[]) {
    try {
      const university = await this.uniRepo.findOneBy({ id: uni_id });
      if (!university) throw new Error("University not found");

      const teacher = await this.TeachRepo.findOne({
        where: { id: teacher_id, university: { id: uni_id } },
        relations: ["university", "teacher_module", "teacher_section"]
      });
      if (!teacher) {
        throw new Error("Teacher not found or does not belong to the university");
      }

      // Handle module removals
      if (module_id && module_id.length > 0) {
        await Promise.all(
          module_id.map(async (moduleId) => {
            const module = await this.modRepo.findOneBy({ id: moduleId });
            if (!module) throw new Error(`Module with ID ${moduleId} not found`);

            const association = await this.teacher_ModuleRepo.findOne({
              where: {
                teacher: { id: teacher_id },
                module: { id: moduleId }
              }
            });
            
            if (!association) {
              throw new Error(`Teacher is not associated with module ${moduleId}`);
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
            if (!section) throw new Error(`Section with ID ${sectionId} not found`);

            const association = await this.teacher_SectionRepo.findOne({
              where: {
                teacher: { id: teacher_id },
                section: { id: sectionId }
              }
            });
            
            if (!association) {
              throw new Error(`Teacher is not associated with section ${sectionId}`);
            }

            await this.teacher_SectionRepo.remove(association);
          })
        );
      }
      const remainingModules = await this.teacher_ModuleRepo.count({ where: { teacher: { id: teacher_id } } });
      const remainingSections = await this.teacher_SectionRepo.count({ where: { teacher: { id: teacher_id } } });
    
      if (remainingModules === 0 && remainingSections === 0) {
        await this.TeachRepo.delete(teacher_id);
        return { success: true, message: "Teacher deleted successfully" };
      }
      
      return { success: true, message: "Teacher associations removed but record kept" };
    
    } catch (error: any) {
      console.error("Error:", error.message);
      throw new Error(error.message || "An error occurred while removing the teacher");
    }
  }
  
  
  

  async addStudent(uni_id: string, program_id: string, section_id: string, data: StudentInterface) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const program = await this.progRepo.findOneBy({ id: program_id });
      if (!program) throw new Error("Program Not found");



      const section = await this.sectionRepo.findOneBy({ id: section_id });
      if (!section) throw new Error("Section Not found");

      const hashPassword = await bcryptservice.hash(data.password);

      if(program.durationType === "semester"){
        const student = this.studentRepo.create({
          email: data.email,
          password: hashPassword,
          semester:data.currentlyStudyingIn,
          uni: uni,
          program: program,
          section: section,
        });
        await this.studentRepo.save(student);
  
        const studentDetails = this.studentDetailsRepo.create({
          first_name: data.details.first_name,
          middle_name: data.details.middle_name,
          last_name: data.details.last_name,
          phone_number: data.details.phone_number,
          DOB: data.details.DOB,
          gender: Gender[data.details.gender as keyof typeof Gender],
          admissionYear: data.details.admissionYear,
          student: student,
        });
  
        await this.studentDetailsRepo.save(studentDetails);
        return student
      }
        const student = this.studentRepo.create({
          email: data.email,
          password: hashPassword,
          year:data.currentlyStudyingIn,
          uni: uni,
          program: program,
          section: section,
        });
        await this.studentRepo.save(student);
  
        const studentDetails = this.studentDetailsRepo.create({
          first_name: data.details.first_name,
          middle_name: data.details.middle_name,
          last_name: data.details.last_name,
          phone_number: data.details.phone_number,
          DOB: data.details.DOB,
          gender: Gender[data.details.gender as keyof typeof Gender],
          admissionYear: data.details.admissionYear,
          student: student,
        });
  
        await this.studentDetailsRepo.save(studentDetails);
        
      
   
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
        relations: ["program", "details", "section"],
      });

      return students;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async editStudent(
    uni_id: string,
    student_id: string,
    program_id: string,
    section_id: string,
    data: StudentInterface
  ) {
    try {
      // Fetch related entities
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");
  
      const program = await this.progRepo.findOneBy({ id: program_id });
      if (!program) throw new Error("Program not found");
  
      const section = await this.sectionRepo.findOneBy({ id: section_id });
      if (!section) throw new Error("Section not found");
  
      const student = await this.studentRepo.findOne({
        where: { id: student_id },
        relations: ["details"],
      });
      if (!student) throw new Error("Student not found");

      const updateStudentData: any = {
        program,
        section,
        email: data.email || student.email,
      };
  
      if (program.durationType === "semester") {
        updateStudentData.semester = data.currentlyStudyingIn || student.semester;
      } else {
        updateStudentData.year = data.currentlyStudyingIn || student.year;
      }

      await this.studentRepo.update({ id: student_id }, updateStudentData);
  
      // Update student details
      if (student.details) {
        await this.studentDetailsRepo.update(
          { id: student.details.id },
          {
            first_name: data.details.first_name || student.details.first_name,
            middle_name: data.details.middle_name || student.details.middle_name,
            last_name: data.details.last_name || student.details.last_name,
            phone_number: data.details.phone_number || student.details.phone_number,
            DOB: data.details.DOB || student.details.DOB,
            gender: data.details.gender
              ? Gender[data.details.gender as keyof typeof Gender]
              : student.details.gender,
            admissionYear: data.details.admissionYear || student.details.admissionYear,
          }
        );
      }
  
      return { message: "Student updated successfully" };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "An error occurred");
    }
  }  
  

  async deleteStudent(uni_id: string, student_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const student = await this.studentRepo.findOne({
        where: { id: student_id, uni: { id: uni_id } },
        relations: ["details"],
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
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      const createAnnouncement = this.AnnouncementRepo.create({
        announce_name: data.announce_name,
        announce_title: data.announce_title,
        announce_date: data.announce_date,
        university: uni,
      });

      const result = await this.AnnouncementRepo.save(createAnnouncement);
      return createAnnouncement;
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

  // async approveRoutine(uni_id: string, routine_id: string) {
  //   try {
  //     const uni = await this.uniRepo.findOneBy({ id: uni_id });
  //     if (!uni) throw new Error("University not found");

  //     const routine = await this.routineRepo.findOneBy({ id: routine_id });
  //     if (!routine) throw new Error("Exam routine not found");

  //     routine.status = RoutineStatus.APPROVED;
  //     routine.approved_by = uni;

  //     return await this.routineRepo.save(routine);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       throw new Error(error.message);
  //     } else {
  //       throw new Error("Failed to approve routine");
  //     }
  //   }
  // }

  // async getRoutinesForAdmin(uni_id: string) {
  //   try {
  //     const uni = await this.uniRepo.findOneBy({ id: uni_id });
  //     if (!uni) throw new Error("University not found");

  //     const routines = await this.routineRepo.find({
  //       relations: ["teacher", "module", "approved_by"],
  //     });

  //     return routines;
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       throw new Error(error.message);
  //     }
  //   }
  // }
}

export default new UniversityService();
