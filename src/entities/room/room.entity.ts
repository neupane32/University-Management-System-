import { Teacher } from "../teacher/teacher.entity";
import Base from "../base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Section } from "../../entities/Section/section.entity";
import { Student } from "../../entities/student/student.entity";

@Entity("Room")
export class Room extends Base {

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @OneToOne(() => Section, (section) => section.room, { onDelete: "CASCADE" })
  @JoinColumn({ name: "section_id" })
  section: Section;

  @OneToOne(() => Teacher, (teacher) => teacher.room, { onDelete: "CASCADE" })
  @JoinColumn({ name: "teacher_id" })
  teacher: Teacher;

  @OneToMany(() => Student, (student) => student.room, { onDelete: "CASCADE" })
  @JoinColumn({ name: "student_id" })
  student: Student[];
}
