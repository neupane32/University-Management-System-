import { University } from "../entities/university/university.entity";
import { AppDataSource } from "../config/database.config";
import { ResourceInterface } from "../interface/resource.interface";
import { Resource } from "../entities/resources/resource.entity";
import { Module } from "../entities/module/module.entity";
import { Teacher } from "../entities/teacher/teacher.entity";
import { TeacherInterface } from "../interface/teacher.interface";
import { AnnouncementInterface } from "../interface/announcement.interface";
import { Announcement } from "../entities/announcement/announcement.entity";
import { StringMappingType } from "typescript";
import { Auth } from "typeorm";
import BcryptService from "../utils/bcrypt.utils";
import HttpException from "../utils/HttpException.utils";
import { error } from "console";
import { AssignmentInterface } from "../interface/assignment.interface";
import { Assignment } from "../entities/Assignment/assignment.entity";
import { ExamRoutine } from "../entities/examRoutine/examRoutine.entity";
import { ExamRoutineInterface } from "../interface/examRoutine.interface";
const bcryptService = new BcryptService();

class TeacherService {
  constructor(
    private readonly uniRepo = AppDataSource.getRepository(University),
    private readonly moduleRepo = AppDataSource.getRepository(Module),
    private readonly teacherRepo = AppDataSource.getRepository(Teacher),
    private readonly resourceRepo = AppDataSource.getRepository(Resource),
    private readonly announceRepo = AppDataSource.getRepository(Announcement),
    private readonly assignmentRepo = AppDataSource.getRepository(Assignment),
    private readonly routineRepo = AppDataSource.getRepository(ExamRoutine)

  ) {}

  async loginTeacher(data: TeacherInterface): Promise<Teacher> {
    try {
      const teacher = await this.teacherRepo.findOne({
        where: [{ email: data.email }],
        select: ["id", "email", "password",
          'role'
        ],
      });

      if (!teacher)
        throw HttpException.badRequest("Entered email is not registered yet");
      const isPassword = await bcryptService.compare(
        data.password,
        teacher.password
      );
      if (!isPassword) throw HttpException.badRequest("Incorrect password");

      return await this.getTeacherById(teacher.id);
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid credentials");
      }
    }
  }

  async getTeacherById(id: string): Promise<Teacher> {
    try {
      const query = this.teacherRepo
        .createQueryBuilder("uni")
        .where("uni.id = :id", { id });

      const teach = await query.getOne();
      if (!teach) throw new Error("Teacher not found");
      return teach;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("User not found");
      }
    }
  }

  async addResource(
    teacher_id: string,
    module_id: string,
    content: any[],
    data: ResourceInterface
  ) {
    try {
      const teacher = await this.teacherRepo.findOne({
        where: { id: teacher_id },
        relations: ["module"],
      });
      if (!teacher) throw new Error("Teacher not found");

      if (teacher.module.id !== module_id)
        throw new Error(
          "Unauthorized: You can only add resources to your module"
        );

      const module = await this.moduleRepo.findOne({
        where: { id: module_id },
      });
      if (!module) throw new Error("Module not found");

      const resource = this.resourceRepo.create({
        name: data.name,
        title: data.title,
        module: module,
        teacher: teacher,
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
          savedFile.transferFileFromTempToUpload(
            savedResource.id,
            savedFile.type
          );
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
        throw new Error(
          "Unauthorized: You can only update resources in your module"
        );

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
          savedFile.transferFileFromTempToUpload(
            updatedResource.id,
            savedFile.type
          );
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
        throw new Error(
          "Unauthorized: You can only delete resources from your module"
        );
      }

      await this.resourceRepo.delete(resource.id);

      return "Resource deleted successfully";
    } catch (error) {
      throw new Error(error.message || "Failed to delete resource");
    }
  }

  async createAnnouncement(
    teacher_id: string,
    module_id: string,
    data: AnnouncementInterface
  ) {
    try {
      const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
      const module = await this.moduleRepo.findOneBy({ id: module_id });

      const announcement = this.announceRepo.create({
        announce_name: data.announce_name,
        annoounce_title: data.announce_title,
        announce_date: data.announce_date,
        teacher: teacher,
        module: module,
      });

      await this.announceRepo.save(announcement);
      return announcement;
    } catch (error) {
      throw new Error(error.message || "Failed to create announcement");
    }
  }

  async updateAnnouncement(
    id: string,
    teacher_id: string,
    module_id: string,
    data: AnnouncementInterface
  ) {
    try {
      const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
      const module = await this.moduleRepo.findOneBy({ id: module_id });
      const announcement = await this.announceRepo.findOneBy({ id });

      if (!announcement) {
        throw new Error("Announcement not found");
      }

      announcement.announce_name = data.announce_name;
      announcement.annoounce_title = data.announce_title;
      announcement.announce_date = data.announce_date;
      announcement.teacher = teacher;
      announcement.module = module;

      await this.announceRepo.save(announcement);
      return announcement;
    } catch (error) {
      throw new Error(error.message || "Failed to update announcement");
    }
  }

  async deleteAnnouncement(id: string) {
    try {
      const announcement = await this.announceRepo.findOneBy({ id });

      if (!announcement) {
        throw new Error("Announcement not found");
      }

      await this.announceRepo.remove(announcement);
      return { message: "Announcement deleted successfully" };
    } catch (error) {
      throw new Error(error.message || "Failed to delete announcement");
    }
  }

  async createAssignment(
    teacher_id: string,
    module_id: string,
    data: AssignmentInterface
  ) {
    try {
      const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
      const module = await this.moduleRepo.findOneBy({ id: module_id });

      const assignment = this.assignmentRepo.create({
        title: data.title,
        description: data.description,
        due_date: data.due_Date,
        teacher: teacher,
        module: module,
      });

      await this.assignmentRepo.save(assignment);
      return assignment;
    } catch (error) {
      throw new Error(error.message || "Failed to create assignment");
    }
  }
  async updateAssignment(
    teacher_id: string,
    assigment_id: string,
    data: AssignmentInterface
  ) {
    try {
      const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
      if(!teacher) throw new Error("You are not authorized")

      const assignment = await this.assignmentRepo.findOneBy({ id:assigment_id, teacher:{id:teacher_id} });
  if(!assignment) throw new Error("Assignment not found")
      const assignments = this.assignmentRepo.update({id:assigment_id},{
        title: data.title,
        description: data.description,
        due_date: data.due_Date,

      });
      return assignments;
    } catch (error) {
      throw new Error(error.message || "Failed to create assignment");
    }
  }

  async createRoutine(teacher_id: string, module_id: string, data: ExamRoutineInterface) {

    const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
      const module = await this.moduleRepo.findOneBy({ id: module_id });

      const routine = this.routineRepo.create({
        title: data.title,
        description: data.description,
        exam_date: data.exam_date,
        teacher: teacher,
        module: module,
      });
      await this.routineRepo.save(routine);
      return routine;

  }
}

export default TeacherService;
