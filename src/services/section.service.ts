import { University } from "../entities/university/university.entity";
import { AppDataSource } from "../config/database.config";
import { Program } from "../entities/Programs/program.entity";
import { Section } from "../entities/Section/section.entity";
import { SectionInterface } from "../interface/section.interface";
import HttpException from "../utils/HttpException.utils";
import { Module } from "../entities/module/module.entity";
import { Teacher } from "../entities/teacher/teacher.entity";

// const bcryptservice = new BcryptService();

class SectionService {
  constructor(
    private readonly sectionRepo = AppDataSource.getRepository(Section),
    private readonly uniRepo = AppDataSource.getRepository(University),
    private readonly programRepo = AppDataSource.getRepository(Program),
    private readonly moduleRepo = AppDataSource.getRepository(Module),
    private readonly teacherRepo = AppDataSource.getRepository(Teacher)
  ) {}

  async addSection(uni_id: string, prog_id: string, data: any) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      const program = await this.programRepo.findOneBy({ id: prog_id });
      if (!program) throw new Error("Program not found");

      const addSection = this.sectionRepo.create({
        name: data.name,
        university: uni,
        program: program,
        module: data.module_id,
        teacher: data.teacher_id,
      });

      await this.sectionRepo.save(addSection);
      return addSection;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Section not found");
      }
    }
  }

  async getSections(uni_id: string, prog_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      const program = await this.programRepo.findOneBy({ id: prog_id });
      if (!program) throw new Error("Program not found");

      const sections = await this.sectionRepo.find({
        where: { university: { id: uni_id }, program: { id: prog_id } },
        relations: ["program", "module", "teacher"],
      });
      if (!module) throw new Error("Module Not found");

      return sections;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unexpected error occurred while fetching modules");
      }
    }
  }

  async updateSection(
    uni_id: string,
    section_id: string,
    program_id: string,
    data: any
  ) {
    try {
      const university = await this.uniRepo.findOneBy({ id: uni_id });
      if (!university) throw new Error("University not found");
      console.log(
        "🚀 ~ SectionService ~ updateSection ~ university:",
        program_id  
      );
      const program = await this.programRepo.findOneBy({ id: program_id });
      if (!program) {
        throw new Error("Program not found");
      }
      const section = await this.sectionRepo.findOneBy({
        id: section_id,
        university: { id: uni_id },
      });
      console.log("🚀 ~ SectionService ~ updateSection ~ section:", section);
      if (!section) throw new Error("Section not found");

      const updateSection = await this.sectionRepo.update(
        { id: section_id },
        {
          name: data.name,
          program: program,
          module: data.module_id,
          teacher: data.teacher_id,
        }
      );
      console.log(
        "🚀 ~ SectionService ~ updateSection ~ updateSection:",
        updateSection
      );
      return updateSection;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Failed to update section");
      }
    }
  }

  async deleteSection(uni_id: string, section_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      const section = await this.sectionRepo.findOneBy({ id: section_id });
      if (!module) throw new Error("Module not found");

      await this.sectionRepo.delete(section_id);
      return "Section deleted successfully";
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Section not found");
      }
    }
  }
}

export default new SectionService();
