import schedule from "node-schedule";
import { Between } from "typeorm";
import { addHours, addMinutes } from "date-fns";
import { AppDataSource } from "../config/database.config";
import { Assignment } from "../entities/Assignment/assignment.entity";
import { Room } from "../entities/room/room.entity";
import { Notification } from "../entities/notification/notification.entity";
import { NotificationType, AssignmentStatus } from "../constant/enum";
import { io, getSocketIdByUserId } from "../socket/socket";

export class CronService {
  private assignmentRepo = AppDataSource.getRepository(Assignment);
  private roomRepo = AppDataSource.getRepository(Room);
  private notificationRepo = AppDataSource.getRepository(Notification);

  constructor() {
    this.initializeJobs();
  }

  private initializeJobs() {
    // Assignment reminders: every hour
    schedule.scheduleJob('* * * * *', () => {
      console.info('[CRON] Checking for assignments due within 24 hours');
      this.sendDueDateNotifications().catch(err => console.error(err));
    });

    // Meeting reminders: every minute
    schedule.scheduleJob('* * * * *', () => {
      console.info('[CRON] Checking for meetings starting in 15 minutes');
      this.sendMeetingNotifications().catch(err => console.error(err));
    });
  }

  private async sendDueDateNotifications() {
    const now = new Date();
    const in24h = addHours(now, 24);
    console.log("🚀 ~ CronService ~ sendDueDateNotifications ~ in24h:", in24h);

    const assignments = await this.assignmentRepo.find({
      where: {
        due_date: Between(now, in24h),
        status: AssignmentStatus.OPEN,
      },
      relations: [
        'teacher',
        'module',
        'module.moduleSection',
        'module.moduleSection.section',
        'module.moduleSection.section.students',
      ],
    });

    for (const assignment of assignments) {
      // gather all students across every section of this module
      const moduleSections = assignment.module.moduleSection || [];
      const students = moduleSections.flatMap(ms => ms.section.students || []);

      for (const student of students) {
        // skip if notification already exists
        const exists = await this.notificationRepo.findOne({
          where: {
            assignment: { id: assignment.id },
            student:     { id: student.id },
            type:        NotificationType.ASSIGNMENT_DUE,
          }
        });
        if (exists) continue;

        const message = `🔔 Reminder: "${assignment.title}" assigment is with in 24 hours:}`;
        const notification = this.notificationRepo.create({
          message,
          type: NotificationType.ASSIGNMENT_DUE,
          isRead: false,
          university: student.uni,
          teacher: assignment.teacher,
          student,
          assignment,
        });
        const saved = await this.notificationRepo.save(notification);
        console.info(`[CRON] Created assignment notification for student ${student.id}`);

        // emit via socket
        const socketId = await getSocketIdByUserId(student.id);
        if (socketId) {
          io.to(socketId).emit('new-assignment', { notification: saved });
          console.info(`[CRON] Emitted new-assignment to student ${student.id}`);
        }
      }
    }
  }

  private async sendMeetingNotifications() {
    const now = new Date();
    const in15 = addMinutes(now, 15);

    const rooms = await this.roomRepo.find({
      where: { startTime: Between(now.toISOString(), in15.toISOString()) },
      relations: ['section', 'section.students', 'teacher'],
    });

    for (const room of rooms) {
      const { students } = room.section;
      for (const student of students) {
        const exists = await this.notificationRepo.findOne({
          where: {
            room:    { id: room.id },
            student: { id: student.id },
            type:    NotificationType.MEETING_REMINDER,
          }
        });
        if (exists) continue;

        const message = `📅 Reminder: Your meeting in section ${room.section.name} starts at ${new Date(room.startTime).toLocaleTimeString()}`;
        const notification = this.notificationRepo.create({
          message,
          type: NotificationType.MEETING_REMINDER,
          isRead: false,
          university: student.uni,
          teacher: room.teacher,
          student,
          room,
        });
        const saved = await this.notificationRepo.save(notification);
        console.info(`[CRON] Created meeting notification for student ${student.id}`);

        const socketId = await getSocketIdByUserId(student.id);
        if (socketId) {
          io.to(socketId).emit('meeting-starting', { notification: saved });
          console.info(`[CRON] Emitted meeting-starting to student ${student.id}`);
        }
      }
    }
  }
}

