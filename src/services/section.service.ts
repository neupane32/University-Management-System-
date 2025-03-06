import { University } from "../entities/university/university.entity";
import { AppDataSource } from "../config/database.config";
import { Program } from "../entities/Programs/program.entity";
import { Section } from "../entities/Section/section.entity";
import { SectionInterface } from "../interface/section.interface";
import HttpException from "../utils/HttpException.utils";

// const bcryptservice = new BcryptService();

class SectionService {
  constructor(
    private readonly sectionRepo = AppDataSource.getRepository(Section),
    private readonly uniRepo = AppDataSource.getRepository(University),
    private readonly programRepo = AppDataSource.getRepository(Program),

  ){}

  async addSection(uni_id: string, program_id: string,  data: SectionInterface) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      const program = await this.programRepo.findOneBy({id: program_id})
      if(!program) throw new Error("Program Not Found");

      const addSection = this.sectionRepo.create({
        name: data.name,
        university: uni,
        program: program
      });

      await this.sectionRepo.save(addSection);
      return "Section created successfully";
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid request");
      }
    }
  }

  async getSections(uni_id: string, program_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");
  
      const program = await this.programRepo.findOneBy({ id: program_id });
      if (!program) throw new Error("Program not found");

      const sections = await this.sectionRepo.find({
        where: {
          university: uni,
          program: program,
        },
      });
  
      if (sections.length === 0) throw new Error("No sections found");
      return sections;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid request");
      }
    }
  }
}
  

export default new SectionService();