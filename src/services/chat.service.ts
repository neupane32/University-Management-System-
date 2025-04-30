import { Student } from "../entities/student/student.entity";
import { AppDataSource } from "../config/database.config";
import { Chat } from "../entities/chat/chat.entity";
import { Teacher } from "../entities/teacher/teacher.entity";
import { University } from "../entities/university/university.entity";
import { io, getSocketIdByUserId } from "../socket/socket";
class ChatService {
  constructor(
    private readonly chatRepo = AppDataSource.getRepository(Chat),
    private readonly studentRepo = AppDataSource.getRepository(Student),
    private readonly teachRepo = AppDataSource.getRepository(Teacher),
    private readonly uniRepo = AppDataSource.getRepository(University)
  ) {}

  async addChat(
    message: string,
    senderType: string,
    senderId: string,
    receiverType: string,
    receiverId: string
  ) {
    const chatData: Partial<Chat> = { message };
    //Assing Sender
    if (senderType === "TEACHER") {
      chatData.teacherSender = { id: senderId } as any;
    } else if (senderType === "STUDENT") {
      chatData.studentSender = { id: senderId } as any;
    } else {
      throw new Error("Invalid sender type");
    }
    //Assign Receiver
    if (receiverType === "TEACHER") {
      chatData.teacherReceiver = { id: receiverId } as any;
    } else if (receiverType === "STUDENT") {
      chatData.studentReceiver = { id: receiverId } as any;
    } else {
      throw new Error("Invalid receiver type");
    }
    //create and save
    const chat = this.chatRepo.create(chatData);
    const savedChat = await this.chatRepo.save(chat);

    const fullChat = await this.chatRepo.findOne({
      where: { id: savedChat.id },
      relations: [
        "teacherSender",
        "studentSender",
        "teacherReceiver",
        "studentReceiver",
      ],
    });

    const socketId = await getSocketIdByUserId(receiverId);
    if (socketId) {
      io.to(socketId).emit("new_message", fullChat);
    }
    return fullChat;
  }
  
  async getChatBetweenUsers(id1: string, id2: string): Promise<Chat[]> {
    return this.chatRepo
      .createQueryBuilder("chat")
      .leftJoinAndSelect("chat.teacherSender", "teacherSender")
      .leftJoinAndSelect("chat.studentSender", "studentSender")
      .leftJoinAndSelect("chat.teacherReceiver", "teacherReceiver")
      .leftJoinAndSelect("chat.studentReceiver", "studentReceiver")
      .where(
        `(chat.teacherSenderId  = :id1 OR chat.studentSenderId  = :id1)
         AND
         (chat.teacherReceiverId = :id2 OR chat.studentReceiverId = :id2)`,
        { id1, id2 }
      )
      .orWhere(
        `(chat.teacherSenderId  = :id2 OR chat.studentSenderId  = :id2)
         AND
         (chat.teacherReceiverId = :id1 OR chat.studentReceiverId = :id1)`,
        { id1, id2 }
      )
      .orderBy("chat.createdAt", "ASC")
      .getMany();
  }
  async getStudent(teacher_id: string) {
    console.log("🚀 ~ ChatService ~ getStudent ~ teacher_id:", teacher_id);
    try {
      const teacher = await this.teachRepo.findOne({
        where: { id: teacher_id },
        relations: ["university"],
      });
      console.log("🚀 ~ ChatService ~ getStudent ~ teacher:", teacher);
      const uni = await this.uniRepo.findOneBy({ id: teacher.university.id });

      if (!uni) throw new Error("University Not found");

      const students = await this.studentRepo.find({
        where: { uni: { id: uni.id } },
      });

      return students;
    } catch (error) {
      console.log("🚀 ~ ChatService ~ getStudent ~ error:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
  async getTeachers(teacher_id: string) {
    console.log("🚀 ~ ChatService ~ getStudent ~ teacher_id:", teacher_id);
    try {
      const teacher = await this.teachRepo.findOne({
        where: { id: teacher_id },
        relations: ["university"],
      });
      console.log("🚀 ~ ChatService ~ getStudent ~ teacher:", teacher);
      const uni = await this.uniRepo.findOneBy({ id: teacher.university.id });

      if (!uni) throw new Error("University Not found");

      const students = await this.teachRepo.find({
        where: {
          university: { id: uni.id },
        },
      });

      return students;
    } catch (error) {
      console.log("🚀 ~ ChatService ~ getStudent ~ error:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async getStudentByStudent(student_id: string) {
    console.log("lado");
    console.log("🚀 ~ ChatService ~ getStudent ~ student_id:", student_id);
    try {
      const teacher = await this.studentRepo.findOne({
        where: { id: student_id },
        relations: ["uni"],
      });
      console.log("🚀 ~ ChatService ~ getStudent ~ teacher:", teacher);
      const uni = await this.uniRepo.findOneBy({ id: teacher.uni.id });

      if (!uni) throw new Error("University Not found");

      const students = await this.studentRepo.find({
        where: { uni: { id: uni.id } },
      });

      return students;
    } catch (error) {
      console.log("🚀 ~ ChatService ~ getStudent ~ error:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
  async getTeachersByStudent(student_id: string) {
    console.log("🚀 ~ ChatService ~ getStudent ~ student_id:", student_id);
    try {
      const teacher = await this.studentRepo.findOne({
        where: { id: student_id },
        relations: ["uni"],
      });
      console.log("🚀 ~ ChatService ~ getStudent ~ teacher:", teacher);
      const uni = await this.uniRepo.findOneBy({ id: teacher.uni.id });

      if (!uni) throw new Error("University Not found");

      const students = await this.teachRepo.find({
        where: {
          university: { id: uni.id },
        },
      });

      return students;
    } catch (error) {
      console.log("🚀 ~ ChatService ~ getStudent ~ error:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}
export default new ChatService();
