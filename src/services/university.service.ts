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
import { ResourceInterface } from "../interface/resource.interface";
import { Resource } from "../entities/resources/resource.entity";

const bcryptservice = new BcryptService();

class UniversityService {
  constructor(
    private readonly uniRepo = AppDataSource.getRepository(University),
    private readonly progRepo = AppDataSource.getRepository(Program),
    private readonly modRepo = AppDataSource.getRepository(Module),
    private readonly TeachRepo = AppDataSource.getRepository(Teacher),
    private readonly resourceRepo = AppDataSource.getRepository(Resource)

  ) {}

  async createUniversity(data: UniversityInterface) {
    try {
      const emailExist = await this.uniRepo.findOneBy({
        email: data.email,
      });

      if (emailExist) throw new Error("The email is already exists");
      if (data.password !== data.confirm_password)
        throw new Error("Please enter the same password");
      const hashPassword = await bcryptservice.hash(data.password);
      const auth = this.uniRepo.create({
        email: data.email,
        universityName: data.university_name,
        password: hashPassword,
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
      // if(!user?.Verified) throw HttpException.unauthorized("Otp is not verified yet")
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

  async addProgram(uni_id: string, data: ProgramInterface) {
    try {
      const uniId = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uniId) throw new Error("University Not found");

      const addProgram = this.progRepo.create({
        name: data.name,
        duration: data.duration,
        university: uniId,
      });
      await this.progRepo.save(addProgram);
      return "Program created successfully";
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

      const program = await this.progRepo
        .createQueryBuilder("program")
        .leftJoinAndSelect("program.uni", "uni")
        .leftJoinAndSelect("program.module", "module")
        .where("program.uni_id = :uni_id", { uni_id })
        .getMany();

      if (program.length === 0) throw new Error("Program not found");
      return program;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid credentials");
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
        university: uni,
        program: program,
      });

      await this.modRepo.save(addModule);
      return addModule;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Course not found");
      }
    }
  }

  async updateModule(uni_id: string, module_id: string, data: ModuleInterface) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      const prog = await this.progRepo.findOneBy({ id: module_id });
      if (!prog) throw new Error("No Program not found");

      const updateModule = await this.modRepo.update(
        { university: uni, id: module_id! },
        {
          name: data.name,
          module_code: data.module_code,
          program: prog,
          university: uni,
        }
      );
      return "Module update Successfully";
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Module not found");
      }
    }
  }

  async findModule(user_id: string) {
    try {
      const findMod = await this.modRepo
        .createQueryBuilder("module")
        .leftJoinAndSelect("module.university", "university")

        .where("module.admin = :user_id", { user_id })
        .getMany();

      return findMod;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Module not found");
      }
    }
  }

  async deleteModule(uni_id: string, module_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("admin not found");

      const module = await this.modRepo.findOneBy({ id: module_id });
      if (!module) throw new Error("No Faculty found");

      await this.modRepo.delete({ university: uni, id: module_id! });
      return "Module Deleted successfully";
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Module not found");
      }
    }
  }
  
  async addTeacher(uni_id: string, data: TeacherInterface) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const teacher = this.TeachRepo.create({
        name: data.name,
        email: data.email,
        password: data.password,
        gender: data.gender,
        contact: data.contact,
        university: uni,
      });
      return teacher;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Teacher not found");
      }
    }
  }

  async updateTeacher(uni_id: string, teacher_id: string, data:TeacherInterface){
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const teacher = await this.uniRepo.findOneBy({ id: teacher_id });
      if (!teacher) throw new Error("Teacher not found Not found");

      const update = this.TeachRepo.update({id:teacher_id},{
        name: data.name,
        email: data.email,
        password: data.password,
        gender: data.gender,
        contact: data.contact,
        university: uni,
      })
      return 'Teacher Update successfully';

      
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Teacher not found");
      }
    }
  }

  async getTeachers(uni_id: string) {
    try {
      const university = await this.uniRepo.findOneBy({ id: uni_id });
      
      if (!university) {
        throw new Error("University not found");
      }
  
      const teachers = await this.TeachRepo.find({ where: { university } });
  
      if (!teachers.length) {
        throw new Error("No teachers found for this university");
      }
      return teachers;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Failed to fetch teachers");
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

  async deleteTeacher(uni_id: string, teacher_id: string) {
    try {
      const teacher = await this.TeachRepo.findOne({
        where: { id: teacher_id, university: { id: uni_id } },
      });

      if (!teacher) {
        throw new Error("Teacher not found or does not belong to the university");
      }

      await this.TeachRepo.delete({ id: teacher_id });

      return "Teacher deleted successfully";
    } catch (error: any) {
      throw new Error(error.message);
    }
}

  


  
  
}

export default new UniversityService();
