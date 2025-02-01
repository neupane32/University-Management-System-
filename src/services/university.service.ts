import { AppDataSource } from "../config/database.config";
import { UniversityInterface } from "../interface/university.interface";
import { University } from "../entities/university/university.entity";
import BcryptService from "../utils/bcrypt.utils";
import HttpException from "../utils/HttpException.utils";
import { ProgramInterface } from "../interface/program.interface";
import { Program } from "../entities/Programs/program.entity";
import { ModuleInterface } from "../interface/module.interface";
import { Module } from "../entities/module/module.entity";

const bcryptservice = new BcryptService();

class UniversityService {
  constructor(
    private readonly uniRepo = AppDataSource.getRepository(University),
    private readonly progRepo = AppDataSource.getRepository(Program),
    private readonly modRepo = AppDataSource.getRepository(Module)
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
        .leftJoinAndSelect('program.module', 'module')
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
}

export default new UniversityService();
