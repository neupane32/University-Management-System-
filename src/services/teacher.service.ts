import { University } from "../entities/university/university.entity";
import { AppDataSource } from "../config/database.config";
import { ResourceInterface } from "../interface/resource.interface";
import { Resource } from "../entities/resources/resource.entity";
import { Module } from "../entities/module/module.entity";
import { Teacher } from "../entities/teacher/teacher.entity";
import { TeacherInterface } from "../interface/teacher.interface";

class TeacherService {
  constructor(
    private readonly uniRepo = AppDataSource.getRepository(University),
    private readonly moduleRepo = AppDataSource.getRepository(Module),
    private readonly teacherRepo = AppDataSource.getRepository(Teacher),
    private readonly resourceRepo = AppDataSource.getRepository(Resource)
  ) {}

  async addResource(teacher_id: string, module_id: string, content: any[], data: ResourceInterface) {
    try {
      const teacher = await this.teacherRepo.findOne({ where: { id: teacher_id }, relations: ["module"] });
      if (!teacher) throw new Error("Teacher not found");
  
      if (teacher.module.id !== module_id) throw new Error("Unauthorized: You can only add resources to your module");
  
      const module = await this.moduleRepo.findOne({ where: { id: module_id } });
      if (!module) throw new Error("Module not found");
  
      const resource = this.resourceRepo.create({
        name: data.name,
        title: data.title,
        module: module,
        teacher: teacher
      });
  
      const savedResource = await this.resourceRepo.save(resource);
  
      if (content && content.length > 0) {
        for (const file of content) {
          const resourceFile = this.resourceRepo.create({
            name: file.name,
            mimetype: file.mimetype,
            type: file.type,
            module: module,
            teacher: teacher,
          });
  
          const savedFile = await this.resourceRepo.save(resourceFile);
          savedFile.transferFileFromTempToUpload(savedResource.id, savedFile.type);
        }
      }
  
      return "Resource added successfully";
  
    } catch (error) {
      throw new Error(error.message || "Failed to add resource");
    }
  }
  

  async updateResource(
    resource_id: string,
    teacher_id: string,
    module_id: string,
    content: any[],
    data: Partial<ResourceInterface>
  ) {
    try {
      const teacher = await this.teacherRepo.findOne({
        where: { id: teacher_id },
        relations: ["module"],
      });
      if (!teacher) throw new Error("Teacher not found");
  
      if (teacher.module.id !== module_id)
        throw new Error("Unauthorized: You can only update resources in your module");
  
      const module = await this.moduleRepo.findOne({
        where: { id: module_id },
      });
      if (!module) throw new Error("Module not found");
  
      const resource = await this.resourceRepo.findOne({
        where: { id: resource_id, module: { id: module_id } },
      });
      if (!resource) throw new Error("Resource not found");
  
      if (data.name) resource.name = data.name;
      if (data.title) resource.title = data.title;
  
      const updatedResource = await this.resourceRepo.save(resource);
  
      if (content && content.length > 0) {
        for (const file of content) {
          const resourceFile = this.resourceRepo.create({
            name: file.name,
            mimetype: file.mimetype,
            type: file.type,
            module: module,
            teacher: teacher,
          });
  
          const savedFile = await this.resourceRepo.save(resourceFile);
          savedFile.transferFileFromTempToUpload(updatedResource.id, savedFile.type);
        }
      }
  
      return "Resource updated successfully";
    } catch (error) {
      throw new Error(error.message || "Failed to update resource");
    }
  }

  async deleteResource(teacher_id: string, resource_id: string) {
    try {
        const teacher = await this.teacherRepo.findOne({
            where: { id: teacher_id },
            relations: ["module"],
        });
        if (!teacher) throw new Error("Teacher not found");

        const resource = await this.resourceRepo.findOne({
            where: { id: resource_id },
            relations: ["module"],
        });
        if (!resource) throw new Error("Resource not found");

        if (resource.module.id !== teacher.module.id) {
            throw new Error("Unauthorized: You can only delete resources from your module");
        }

        await this.resourceRepo.delete(resource.id);

        return "Resource deleted successfully";
    } catch (error) {
        throw new Error(error.message || "Failed to delete resource");
    }
}



}

export default TeacherService;
