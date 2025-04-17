import { University } from "../entities/university/university.entity";
import { AppDataSource } from "../config/database.config";
import { Program } from "../entities/Programs/program.entity";
import { Section } from "../entities/Section/section.entity";
import { SectionInterface } from "../interface/section.interface";
import HttpException from "../utils/HttpException.utils";
import { Module } from "../entities/module/module.entity";
import { Module_Section } from "../entities/ModuleSection/ModuleSection.entity";
import { Teacher_Section } from "../entities/TeacherSection/TeacherSection.entity";

// const bcryptservice = new BcryptService();

class SectionService {
  constructor(
    private readonly sectionRepo = AppDataSource.getRepository(Section),
    private readonly uniRepo = AppDataSource.getRepository(University),
    private readonly programRepo = AppDataSource.getRepository(Program),
    private readonly moduleRepo = AppDataSource.getRepository(Module),
    private readonly moduleSectionRepo = AppDataSource.getRepository(Module_Section),
    private readonly teacherSection = AppDataSource.getRepository(Teacher_Section)
  ) {}

  async addSection(
    uni_id: string,
    module_id: any[],
    prog_id: string,
    data: any
  ) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      const program = await this.programRepo.findOneBy({ id: prog_id });
      if (!program) throw new Error("Program not found");
      const addSection = this.sectionRepo.create({
        name: data.name,
        durationReference: data.durationReference,
        university: uni,
        program: program,
      });
      await this.sectionRepo.save(addSection);
     // In addSection method, correct the variable name and entity usage
await Promise.all(
  module_id.map(async (moduleId) => {
    const module = await this.moduleRepo.findOneBy({ id: moduleId });
    if (!module) throw new Error(`Module with ID ${moduleId} not found`);

    const moduleSection = this.moduleSectionRepo.create({
      section: addSection,
      module,
    });
    console.log("🚀 ~ SectionService ~ module_id.map ~ moduleSection:", moduleSection)
    await this.moduleSectionRepo.save(moduleSection);
  })
);
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
    console.log("🚀 ~ SectionService ~ getSections ~ prog_id:", prog_id);
    try {
      const university = await this.uniRepo.findOneBy({ id: uni_id });
      if (!university) throw new Error("University not found");

      const teacherSection = await this.teacherSection.find({relations:["teacher", "section"]})
  
      const sections = await this.sectionRepo
      .createQueryBuilder("section")
      .leftJoinAndSelect("section.program", "program")
      .leftJoinAndSelect("section.university", "university")
      .leftJoinAndSelect("section.moduleSection", "moduleSection")
      .leftJoinAndSelect("moduleSection.module", "module")
      .leftJoinAndSelect("section.teacher_Section", "teacherSection")
      .leftJoinAndSelect("teacherSection.teacher", "teacher")
      .where("section.university = :uniId", { uniId: uni_id })
      .getMany();
    
      if (!sections.length) throw new Error("No sections found");
      console.log("🚀 ~ SectionService ~ getSections ~ sections:", sections);
  
      return sections.map((section) => ({
        ...section,
        modules: section.moduleSection?.map((ms) => ms.module) || [],
        // Include teachers if needed
        teachers: section.teacher_Section?.map((ts) => ts.teacher) || [],
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
        where: { university: { id: uni_id } },
      });

      return sections;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unexpected error occurred while fetching modules");
      }
    }
  }
  async getSectionByProgramId(uni_id: string, progId:string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      const sections = await this.sectionRepo.find({
        where: { university: { id: uni_id }, program:{id:progId} },
      }
    
    );
      console.log("🚀 ~ SectionService ~ getSectionByProgramId ~ sections:", sections)

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
    module_id: any[],
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
        }
      );
      const findModuleSection = await this.moduleSectionRepo.find({
        where: {
          section: { id: section_id },
        },
        relations: ["module"],
      });
      const existingModuleIds = new Set(
        findModuleSection
          .map((tm) => tm.module?.id)
          .filter((id): id is string => Boolean(id))
      );
      const newModuleIds = new Set(module_id);
      for (const relation of findModuleSection) {
        if (relation.module?.id && !newModuleIds.has(relation.module.id)) {
          await this.moduleSectionRepo.delete({
            section: { id: section_id },
            module: { id: relation.module.id },
          });
        }
      }
      for (const moduleId of module_id) {
        if (!existingModuleIds.has(moduleId)) {
          const module = await this.moduleRepo.findOneBy({
            id: moduleId,
          });
          if (!module) throw new Error(`Module with ID ${moduleId} not found`);
          const existingRelation = await this.moduleSectionRepo.findOne({
            where: { section: { id: section_id }, module: { id: moduleId } },
          });
          if (!existingRelation) {
            const newRelation = this.moduleSectionRepo.create({
              section,
              module: { id: moduleId },
            });
            await this.moduleSectionRepo.save(newRelation);
          }
        }
      }

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
      if (!section) throw new Error("Section not found");
  
      await this.moduleSectionRepo.delete({ section: { id: section_id } });
  
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
