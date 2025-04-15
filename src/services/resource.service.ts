import { AppDataSource } from "../config/database.config";
import { Resource } from "../entities/resources/resource.entity";
import { Module } from "../entities/module/module.entity";
import { Teacher } from "../entities/teacher/teacher.entity";
import { Teacher_Section } from "../entities/TeacherSection/TeacherSection.entity";
import { Student } from "../entities/student/student.entity";
import { Notification } from "../entities/notification/notification.entity";
import { NotificationType } from "../constant/enum";
import { getSocketIdByUserId } from "../socket/socket";
import { io } from "../socket/socket";

class ResourceService {
  constructor(
    private readonly moduleRepo = AppDataSource.getRepository(Module),
    private readonly teacherRepo = AppDataSource.getRepository(Teacher),
    private readonly resourceRepo = AppDataSource.getRepository(Resource),
    private readonly teacher_sectionRepo = AppDataSource.getRepository(
      Teacher_Section
    ),
    private readonly studentRepo = AppDataSource.getRepository(Student),
    private readonly notificationRepo = AppDataSource.getRepository(
      Notification
    )
  ) {}

  async addResource(
    data: any,
    TeacherResourceFile: string,
    teacher_id: string
  ) {
    try {
      const teacherSection = await this.teacher_sectionRepo.findOne({
        where: {
          teacher: { id: teacher_id },
          section: { id: data.section_id },
        },
      });
      if (!teacherSection) {
        throw new Error("Teacher is not assigned to this section");
      }

      const addResource = this.resourceRepo.create({
        title: data.title,
        module: { id: data.module_id },
        section: { id: data.section_id },
        teacher: { id: teacher_id },
        resourcePath: TeacherResourceFile,
      });
      await this.resourceRepo.save(addResource);

      const teacher = await this.teacherRepo.findOne({
        where: { id: teacher_id },
        relations: ["university"],
      });
      if (!teacher) throw new Error("Teacher not found");

      const students = await this.studentRepo.find({
        where: { section: { id: data.section_id } },
      });
      const resourceNotifications = students.map((student) =>
        this.notificationRepo.create({
          message: `New resource posted: ${addResource.title}`,
          type: NotificationType.RESOURCE,
          university: teacher.university,
          student: student,
          resource: addResource,
        })
      );
      //save all the notification to the database first
      const notificationToSave = [...resourceNotifications];
      const savedNotifications =
        await this.notificationRepo.save(notificationToSave);

      //after saving, iterate over saved notification and emit through the socket
      savedNotifications.forEach(async (notification) => {
        const detailedNotification = await this.notificationRepo.findOne({
          where: { id: notification.id },
          relations: ["student", "resource"],
        });
        console.log(
          "🚀 ~ ResourceService ~ savedNotifications.forEach ~ detailedNotification:",
          detailedNotification
        );

        if (notification.student) {
          const socket_id = await getSocketIdByUserId(notification.student.id);
          console.log(
            "🚀 ~ ResourceService ~ savedNotifications.forEach ~ socket_id:",
            socket_id
          );
          if (socket_id && detailedNotification) {
            io.to(socket_id).emit("new-resource", {
              notification: detailedNotification,
            });
          }
        }
      });
      return addResource;
    } catch (error) {
      console.log("🚀 ~ error:", error);
    }
  }

  async getResource(teacher_id: string, module_id: string) {
    const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
    if (!teacher) throw new Error("Teacher Not Found");

    const module = await this.moduleRepo.findOneBy({ id: module_id });
    if (!module) throw new Error("Module Not Found");

    return await this.resourceRepo.find({
      where: { teacher: { id: teacher_id }, module: { id: module_id } },
      relations: ["teacher", "module", "section"],
      order: { createdAt: "DESC" },
    });
  }

  async getResourceByStudent(module_id: string) {
    const module = await this.moduleRepo.findOneBy({ id: module_id });
    if (!module) throw new Error("Module Not Found");

    return await this.resourceRepo.find({
      where: { module: { id: module_id } },
      relations: ["module", "section"],
      order: { createdAt: "DESC" },
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
