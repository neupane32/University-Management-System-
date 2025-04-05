import { AppDataSource } from "../config/database.config";
import { Resource } from "../entities/resources/resource.entity";
import { Module } from "../entities/module/module.entity";
import { Teacher } from "../entities/teacher/teacher.entity";
import { Teacher_Module } from "../entities/TeacherModule/teacherModule.entity";
import { Teacher_Section } from "../entities/TeacherSection/TeacherSection.entity";


class ResourceService {
  constructor(
    private readonly moduleRepo = AppDataSource.getRepository(Module),
    private readonly teacherRepo = AppDataSource.getRepository(Teacher),
    private readonly teacher_moduleRepo = AppDataSource.getRepository(Teacher_Module),
    private readonly resourceRepo = AppDataSource.getRepository(Resource),
    private readonly teacher_sectionRepo = AppDataSource.getRepository(Teacher_Section),
  ) {}

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
}

export default ResourceService;
