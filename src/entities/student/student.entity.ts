import { University } from "../../entities/university/university.entity";
import { Gender, Role } from "../../constant/enum";
import Base from "../../entities/base.entity";
import { Column, Entity, OneToMany, ManyToOne, JoinColumn } from "typeorm";

import { Section } from "../../entities/Section/section.entity";
import { Student_Assignment } from "../../entities/Assignment/student_assignment.entity";
import { Attendance } from "../../entities/Attendance/attendance.entity";
import { Notification } from "../../entities/notification/notification.entity";
import { Room } from "../../entities/room/room.entity";
import { Chat } from "../../entities/chat/chat.entity";

@Entity("student")
export class Student extends Base {
  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({ select: false, nullable: false })
  password: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.STUDENT,
  })
  role: Role;

  @Column()
  first_name: string;

  @Column({ nullable: true })
  middle_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column()
  DOB: string;

  @Column({ type: "enum", enum: Gender })
  gender: Gender;

  @Column()
  admissionYear: number;

  @Column()
  profileImagePath: string;

  @ManyToOne(() => University, (uni) => uni.student, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "uni_id" })
  uni: University;

  @ManyToOne(() => Section, (section) => section.students, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "section_id" })
  section: Section;

  @OneToMany(() => Student_Assignment, (submission) => submission.student, {
    onDelete: "CASCADE",
  })
  submission: Student_Assignment;

  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendances: Attendance[];

  @OneToMany(() => Notification, (notification) => notification.student, {
    onDelete: "CASCADE",
  })
  notification: Notification[];

  @ManyToOne(() => Room, (room) => room.student, {cascade: true})
  room: Room;
  @OneToMany(() => Chat, chat => chat.studentSender)
  sentChats: Chat[];

  @OneToMany(() => Chat, chat => chat.studentReceiver)
  receivedChats: Chat[];
}
