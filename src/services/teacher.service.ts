import { AppDataSource } from "../config/database.config";
import { Module } from "../entities/module/module.entity";
import { Teacher } from "../entities/teacher/teacher.entity";
import { TeacherInterface } from "../interface/teacher.interface";
import BcryptService from "../utils/bcrypt.utils";
import HttpException from "../utils/HttpException.utils";
import { Teacher_Module } from "../entities/TeacherModule/teacherModule.entity";
import { Teacher_Section } from "../entities/TeacherSection/TeacherSection.entity";
import { Notification } from "../entities/notification/notification.entity";


const bcryptService = new BcryptService();

class TeacherService {
  constructor(
    private readonly teacher_moduleRepo = AppDataSource.getRepository(Teacher_Module),
    private readonly teacherRepo = AppDataSource.getRepository(Teacher),
    private readonly teacher_sectionRepo = AppDataSource.getRepository(Teacher_Section),
    private readonly notificationRepo = AppDataSource.getRepository(Notification),
    private readonly moduleRepo = AppDataSource.getRepository(Module),



  ) {}

  async loginTeacher(data: TeacherInterface): Promise<Teacher> {
    try {
      const teacher = await this.teacherRepo.findOne({
        where: [{ email: data.email }],
        select: ["id", "email", "password", "role"],
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
      console.log("🚀 ~ TeacherService ~ loginTeacher ~ error:", error);
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid credentials");
      }
    }
  }
  async getTeacherSections(teacher_id: string) {
    if (!teacher_id) {
      throw HttpException.notFound("Teacher is not registered yet");
    }
  
    const getTeacherSection = await this.teacherRepo.createQueryBuilder("teacher")
      .leftJoinAndSelect("teacher.teacher_section", "teacherSection")
      .leftJoinAndSelect("teacherSection.section", "section")
      .leftJoinAndSelect("teacher.teacher_module", "teacherModule")
      .leftJoinAndSelect("teacherModule.module", "module")
      .where("teacher.id = :teacher_id", { teacher_id })
      .getMany();
  


      console.log("🚀 ~ TeacherService ~ getTeacherSections ~ getTeacherSection:", getTeacherSection)

    return getTeacherSection;
  }

  async teacherProfile(teacher_id: string) {
    try {
      const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
      if (!teacher) throw new Error(" Teacher not found");
      console.log("🚀 ~ teacherProfile ~ teacher:", teacher)
      
      return teacher;
    } catch (error) {
    console.log("🚀 ~ teacherProfile ~ error:", error)
    }
  }

  async updateProfile(teacher_id: string, data: TeacherInterface, teacherProfileImage: string) {
    try {
      const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
      if (!teacher) throw new Error("Teacher not found");

      const updateProfile  = await this.teacherRepo.update(
        {
           id: teacher_id 
        },
        {
        name: data.name,
        email: data.email,
        contact: data.contact,
        profileImagePath: teacherProfileImage
        }
      );
      console.log("🚀 ~ TeacherService ~ updateProfile ~ updateProfile:", updateProfile)
      const updatedTeacher = await this.teacherRepo.findOneBy({ id: teacher_id });
      
      console.log("🚀 ~ TeacherService ~ updateProfile ~ updatedTeacher:", updatedTeacher);

      return updatedTeacher;
    } catch (error) {
      console.log("🚀 ~ updateProfile ~ error:", error)
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

  async getModulesByTeacher(teacher_id: string) {
    console.log(
      "🚀 ~ TeacherService ~ getModulesByTeacher ~ teacher_id:",
      teacher_id
    );
    try {
      const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
      if (!teacher) throw HttpException.notFound("not found");
      console.log(
        "🚀 ~ TeacherService ~ getModulesByTeacher ~ teacher:",
        teacher
      );
  
      const modules = await this.teacher_moduleRepo
        .createQueryBuilder("teacher_module")
        .leftJoinAndSelect("teacher_module.module", "module")
        .where("teacher_module.teacher_id = :teacher_id", { teacher_id })
        .getMany();
  
      console.log(
        "🚀 ~ TeacherService ~ getModulesByTeacher ~ modules:",
        modules
      );
      if (!modules.length) {
        throw new Error("No modules found for this teacher");
      }
  
    // Filter out duplicates based on module id while keeping the original format.
      const uniqueModules = modules.filter((item, index, self) =>
        index === self.findIndex((t) => t.module.id === item.module.id)
      );
  
      return uniqueModules;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch modules"
      );
    }
  }
  

  async getSectionsByModule(teacherId: string, moduleId: string) {
    try {
      const sections = await this.teacher_sectionRepo
        .createQueryBuilder("ts")
        .leftJoinAndSelect("ts.section", "section")
        .leftJoinAndSelect("section.moduleSection", "moduleSection")
        .leftJoinAndSelect("moduleSection.module", "module")
        .where("ts.teacher_id = :teacherId", { teacherId })
        .andWhere("module.id = :moduleId", { moduleId })
        .getMany();
  
      return sections.map(ts => ts.section);
    } catch (error) {
      throw new Error('Failed to fetch sections');
    }
  }

  async getTeacherNotifications(teacher_id: string){
    try {
      const teacher = await this.teacherRepo.findOneBy({id: teacher_id})
      if (!teacher) throw new Error ("Teacher not found ");
  
      const getNotification = await this.notificationRepo.find({
        where: { teacher: { id: teacher_id } },
        relations: ["announcement", "resource", "assignment", "routine"],
        order: { createdAt: "DESC" },
      });
      return getNotification;
    }
      catch (error) {
      console.log("🚀 ~ getTeacherNotifications ~ error:", error)
      
    }
}

async getModulesBySectionOfTeacher(sectionId: string, teacherId: string) {
  console.log("🚀 ~ TeacherService ~ getModulesBySectionOfTeacher ~ teacherId:", teacherId);
  console.log("🚀 ~ TeacherService ~ getModulesBySectionOfTeacher ~ sectionId:", sectionId);
  try {
    const modules = await this.teacher_moduleRepo
      .createQueryBuilder("tm")
      .leftJoinAndSelect("tm.module", "module")
      .leftJoinAndSelect("tm.teacher", "teacher")
      .leftJoinAndSelect("module.moduleSection", "ms")
      .where("ms.section = :sectionId", { sectionId })
      .andWhere("teacher.id = :teacherId", { teacherId })
      .getMany();

    console.log("🚀 ~ TeacherService ~ getModulesBySectionOfTeacher ~ modules:", modules);
    return modules;
  } catch (error) {
    console.log("🚀 ~ TeacherService ~ getModulesBySectionOfTeacher ~ error:", error);
  }
}
async getSections(teacherId:string){
  

  const teacherSections = await this.teacher_sectionRepo.find({
    where: { teacher: { id: teacherId } },
    relations: ["section"]
  });

  const sections = teacherSections.map(ts => ts.section);

  const uniqueSections = sections.filter(
    (section, index, self) =>
      self.findIndex(s => s.id === section.id) === index
  );
  
  return uniqueSections;
}
async markAsRead(notificationId:string){
const getNotification=await this.notificationRepo.findOne({
  where:{
    id:notificationId
  }
})
const update= await this.notificationRepo.update({
  id:getNotification.id
},{
  isRead:true
})
return update
}



}

export default TeacherService;
