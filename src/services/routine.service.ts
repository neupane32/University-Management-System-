import { University } from "../entities/university/university.entity";
import { AppDataSource } from "../config/database.config";
import { Routine } from "../entities/Routine/routine.entity";
import { Teacher_Section } from "../entities/TeacherSection/TeacherSection.entity";
import { Teacher_Module } from "../entities/TeacherModule/teacherModule.entity";
import { Student } from "../entities/student/student.entity";
import { Teacher } from "../entities/teacher/teacher.entity";
import { Notification } from "../entities/notification/notification.entity";
import { NotificationType } from "../constant/enum";
import { getSocketIdByUserId } from "../socket/socket";
import { io } from "../socket/socket";
import HttpException from "../utils/HttpException.utils";

class RoutineService {
  constructor(
    private readonly routineRepo = AppDataSource.getRepository(Routine),
    private readonly teacherRepo = AppDataSource.getRepository(Teacher),
    private readonly studentRepo = AppDataSource.getRepository(Student),
    private readonly uniRepo = AppDataSource.getRepository(University),
    private readonly teacherSection = AppDataSource.getRepository(
      Teacher_Section
    ),
    private readonly teacherModule = AppDataSource.getRepository(
      Teacher_Module
    ),
    private readonly notificationRepo = AppDataSource.getRepository(
      Notification
    )
  ) {}
  async createRoutine(uni_id: string, data: any) {
    console.log("🚀 ~ RoutineService ~ createRoutine ~ data:", data);

    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const sectionTeachers = await this.teacherSection.find({
        where: { section: { id: data.section_id } },
        relations: ["teacher"],
      });
      console.log(
        "🚀 ~ RoutineService ~ createRoutine ~ sectionTeachers:",
        sectionTeachers
      );

      const moduleTeachers = await this.teacherModule.find({
        where: { module: { id: data.module_id } },
        relations: ["teacher"],
      });

      const commonTeachers = sectionTeachers.filter((sectionTeacher) =>
        moduleTeachers.some(
          (moduleTeacher) =>
            moduleTeacher.teacher.id === sectionTeacher.teacher.id
        )
      );
      const primaryTeacher = commonTeachers[0].teacher;

      const routine = this.routineRepo.create({
        startTime: data.startTime,
        endTime: data.endTime,
        day: data.day,
        university: uni,
        section: { id: data.section_id },
        module: { id: data.module_id },
        teacher: primaryTeacher,
      });
      console.log("🚀 ~ RoutineService ~ createRoutine ~ routine:", routine);
      const savedRoutine = await this.routineRepo.save(routine);
      console.log("🚀 ~ RoutineService ~ createRoutine ~ saved:", savedRoutine);

      const teacherNotifications = sectionTeachers.map((st) =>
        this.notificationRepo.create({
          message: `New routine scheduled on ${data.day} from ${data.startTime} to ${data.endTime} for module ${data.module_id}.`,
          type: NotificationType.ROUTINE,
          university: uni,
          teacher: st.teacher,
          routine: savedRoutine,
        })
      );

      const students = await this.studentRepo.find({
        where: {
          section: { id: data.section_id },
        },
      });

      const studentNotifications = students.map((student) =>
        this.notificationRepo.create({
          message: `New routine scheduled on ${data.day} from ${data.startTime} to ${data.endTime} for module ${data.module_id}.`,
          type: NotificationType.ROUTINE,
          university: uni,
          student: student,
          routine: savedRoutine,
        })
      );

      const notificationToSave = [
        ...teacherNotifications,
        ...studentNotifications,
      ];
      const savedNotifications =
        await this.notificationRepo.save(notificationToSave);

      //After saying, iterate over saved notifications and emit thorugh the socket
      savedNotifications.forEach(async (notification) => {
        const detailedNotification = await this.notificationRepo.findOne({
          where: { id: notification.id },
          relations: ["teacher", "student", "routine", "university"],
        });
        console.log(
          "🚀 ~ RoutineService ~ savedNotifications.forEach ~ detailedNotification:",
          detailedNotification
        );

        //determine whether this is teacher or student
        if (notification.teacher) {
          const socket_id = await getSocketIdByUserId(notification.teacher.id);
          console.log(
            "🚀 ~ RoutineService ~ savedNotifications.forEach ~ socket_id:",
            socket_id
          );
          if (socket_id && detailedNotification) {
            io.to(socket_id).emit("new-routine", {
              notification: detailedNotification,
            });
          }
        } else if (notification.student) {
          const socket_id = await getSocketIdByUserId(notification.student.id);
          console.log(
            "🚀 ~ RoutineService ~ savedNotifications.forEach ~ socket_id:",
            socket_id
          );
          if (socket_id && detailedNotification) {
            io.to(socket_id).emit("new-routine", {
              notification: detailedNotification,
            });
          }
        }
      });

      return savedRoutine;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid data");
      }
    }
  }

  async getRoutine(uni_id: string, section_id: string) {
    const uni = await this.uniRepo.findOneBy({ id: uni_id });
    if (!uni) throw new Error("University Not found");
    console.log("🚀 ~ RoutineService ~ getRoutine ~ uni:", uni);

    const getRoutines = await this.routineRepo
      .createQueryBuilder("routine")
      .leftJoinAndSelect("routine.section", "section")
      .leftJoinAndSelect("section.program", "program")
      .leftJoinAndSelect("routine.teacher", "teacher")
      .leftJoinAndSelect("routine.module", "module")
      .where("section.id = :section_id", { section_id })
      .getMany();

    return getRoutines;
  }

  async deleteRoutine(uni_id: string, routine_id: string) {
    const uni = await this.uniRepo.findOneBy({ id: uni_id });
    if (!uni) throw new Error("Uni not found");

    const routine = await this.routineRepo.findOneBy({ id: routine_id });
    if (!routine) throw new Error("No Routine found");

    await this.routineRepo.delete({ id: routine.id });

    return "Routine delete successfully";
  }

  async getRoutineByStudent(student_id: string) {
    try {
      const student = await this.studentRepo.findOne({
        where: { id: student_id },
        relations: ["section"],
      });

      if (!student) {
        throw new Error("Student not found");
      }
      if (!student.section) {
        throw new Error("Student section not found");
      }
      const section_id = student.section.id;

      const routines = await this.routineRepo
        .createQueryBuilder("routine")
        .leftJoinAndSelect("routine.section", "section")
        .leftJoinAndSelect("section.program", "program")
        .leftJoinAndSelect("routine.teacher", "teacher")
        .leftJoinAndSelect("routine.module", "module")
        .where("section.id = :section_id", { section_id })
        .getMany();

      return routines;
    } catch (error) {
      console.log("🚀 ~ getRoutineByStudent ~ error:", error);
    }
  }

  async getRoutineByTeacher(teacher_id: string) {
    try {
      const teacher = this.teacherRepo.findOneBy({ id: teacher_id });
      if (!teacher) throw new Error("Teacher not found");

      const getRoutines = await this.routineRepo
        .createQueryBuilder("routine")
        .leftJoinAndSelect("routine.section", "section")
        .leftJoinAndSelect("section.program", "program")
        .leftJoinAndSelect("routine.teacher", "teacher")
        .leftJoinAndSelect("routine.module", "module")
        .where("routine.teacher_id = :teacherId", { teacherId: teacher_id })
        .getMany();
      return getRoutines;
    } catch (error) {
      console.log("🚀 ~ RoutineService ~ getRoutineByTeacher ~ error:", error);
    }
  }

  async updateRoutine(uni_id: string, routine_id: string, data: any) {
    const uni = await this.uniRepo.findOneBy({ id: uni_id });
    if (!uni) throw new Error("University Not found");

    const routine = await this.routineRepo.findOneBy({ id: routine_id });
    if (!routine) throw new Error("Routine Not found");

    const updateRoutine = await this.routineRepo.update(
      { id: routine_id },
      {
        startTime: data.startTime,
        endTime: data.endTime,
        day: data.day,
        section: {
          id: data.section_id,
        },
      }
    );
    return updateRoutine;
  }
}

export default new RoutineService();
