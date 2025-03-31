import { University } from "../entities/university/university.entity";
import { AppDataSource } from "../config/database.config";
import { Program } from "../entities/Programs/program.entity";
import { Section } from "../entities/Section/section.entity";
import { SectionInterface } from "../interface/section.interface";
import HttpException from "../utils/HttpException.utils";
import { Module } from "../entities/module/module.entity";
import { Module_Section } from "../entities/ModuleSection/ModuleSection.entity";

// const bcryptservice = new BcryptService();

class SectionService {
  constructor(
    private readonly sectionRepo = AppDataSource.getRepository(Section),
    private readonly uniRepo = AppDataSource.getRepository(University),
    private readonly programRepo = AppDataSource.getRepository(Program),
    private readonly moduleRepo = AppDataSource.getRepository(Module),
    private readonly moduleSectionRepo = AppDataSource.getRepository(Module_Section)
  ) {}

  async addSection(uni_id: string, prog_id: string, data: any) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");
  
      const program = await this.programRepo.findOneBy({ id: prog_id });
      if (!program) throw new Error("Program not found");
  
      // Create and save the Section
      const addSection = this.sectionRepo.create({
        name: data.name,
        durationReference: data.durationReference,
        university: uni,
        program: program,
      });
      await this.sectionRepo.save(addSection);
  
      const module = await this.moduleRepo.findOneBy({ id: data.module_id });
      if (!module) throw new Error("Module not found");
  
      // Create and save the Module_Section bridge entry
      const moduleSection = this.moduleSectionRepo.create({
        section: addSection,
        module: module
      });
      await this.moduleSectionRepo.save(moduleSection);
  
      return addSection;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Failed to create section");
      }
    }
  }

  async getSections(uni_id: string, prog_id: string) {
    try {
      const university = await this.uniRepo.findOneBy({ id: uni_id });
      if (!university) throw new Error("University not found");
  
      const sections = await this.sectionRepo.createQueryBuilder('section')
        .leftJoinAndSelect('section.moduleSections', 'module_section')
        .leftJoinAndSelect('module_section.module', 'module')
        .leftJoinAndSelect('section.program', 'program')
        .leftJoinAndSelect('section.teacher', 'teacher')
        .where('section.university_id = :uni_id', { uni_id })
        .andWhere('section.program_id = :prog_id', { prog_id })
        .getMany();
  
      if (!sections.length) throw new Error("No sections found");
      
      return sections.map(section => ({
        ...section,
        modules: section.moduleSection?.map(ms => ms.module) || []
      }));
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch sections"
      );
    }
  }

  async getUniversitySections(uni_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      const sections = await this.sectionRepo.find({
        where: { university: { id: uni_id } }
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
