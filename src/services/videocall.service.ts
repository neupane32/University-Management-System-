import { AppDataSource } from "../config/database.config";
import { Teacher } from "../entities/teacher/teacher.entity";
import { Assignment } from "../entities/Assignment/assignment.entity";
import { Student } from "../entities/student/student.entity";
import { Room } from "../entities/room/room.entity";

class videocallService {
  constructor(
    private readonly studentRepo = AppDataSource.getRepository(Student),
    private readonly roomRepo = AppDataSource.getRepository(Room),
    private readonly assignmentRepo = AppDataSource.getRepository(Assignment),
    private readonly teacherRepo = AppDataSource.getRepository(Teacher)
  ) {}

  async createRoom(teacher_id: string, data: any) {
    try {
      const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
      if (!teacher) {
        throw new Error("Teacher not found");
      }

      const room = this.roomRepo.create({
        meetingLink: data.meetingLink,
        startTime: data.startTime,
        endTime: data.endTime,
        section: data.section,
      });

      const savedRoom = await this.roomRepo.save(room);
      return savedRoom;
    } catch (error) {
      console.log("🚀 ~ createRoom ~ error:", error);
    }
  }

  async getRoom(teacher_id: string) {
    try {
      const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
      if (!teacher) {
        throw new Error("Teacher not found");
      }

      const room = await this.roomRepo.findOne({
        where: { teacher: { id: teacher_id } },
        relations: ["section", "student"],
      });

      if (!room) {
        throw new Error("Room not found");
      }

      return room;
    } catch (error) {
      console.log("🚀 ~ getRoom ~ error:", error);
    }
  }

  async getRoomByStudent(student_id: string) {
    const student = await this.studentRepo.findOne({
      where: { id: student_id },
      relations: ["section"]
    });
    if (!student) throw new Error("Student not found");
    if (!student.section) throw new Error("Student is not assigned to any section");

    const room = await this.roomRepo.findOne({
      where: { section: { id: student.section.id } },
      relations: ["section", "teacher"]
    });
    if (!room) throw new Error("No active room for your section");

    const now = new Date();
    const [startH, startM] = room.startTime.split(':').map(Number);
    const [endH, endM] = room.endTime.split(':').map(Number);

    const startDate = new Date(now);
    startDate.setHours(startH, startM, 0, 0);
    const endDate = new Date(now);
    endDate.setHours(endH, endM, 0, 0);

    if (now >= startDate && now <= endDate) {
      return room;
    } else {
      throw new Error("Room is not active at this time");
    }
  }

  async deleteRoom(teacher_id: string, room_id: string) {
    try {
      const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
      if (!teacher) {
        throw new Error("Teacher not found");
      }

      const room = await this.roomRepo.findOneBy({ id: room_id });
      if (!room) {
        throw new Error("Room not found");
      }

      await this.roomRepo.delete({ id: room_id });
      return "Room deleted successfully";
    } catch (error) {
      console.log("🚀 ~ deleteRoom ~ error:", error);
    }
  }
}

export default new videocallService();
