import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import Base from "../../entities/base.entity";
import { University } from "../../entities/university/university.entity";
import { Program } from "../../entities/Programs/program.entity";
import { Student } from "../../entities/student/student.entity";
import { Routine } from "../../entities/Routine/routine.entity";
import { Resource } from "../../entities/resources/resource.entity";
import { Teacher_Section } from "../../entities/TeacherSection/TeacherSection.entity";
import { Module_Section } from "../../entities/ModuleSection/ModuleSection.entity";
import { Attendance } from "../../entities/Attendance/attendance.entity";
import { Room } from "../../entities/room/room.entity";
import { ExamRoutine } from "../../entities/Routine/exam_routine.entity";

@Entity("section")
export class Section extends Base {
  @Column()
  name: string;

  @Column("int", { nullable: true })
  durationReference: number;

  @ManyToOne(() => University, (university) => university.sections, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "university_id" })
  university: University;

  @ManyToOne(() => Program, (program) => program.sections, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "program_id" })
  program: Program;

  @OneToMany(() => Student, (student) => student.section, { cascade: true })
  students: Student[];

  @OneToMany(() => Resource, (resource) => resource.section, { cascade: true })
  resource: Resource[];

  @OneToMany(() => Routine, (routine) => routine.section, { cascade: true })
  routine: Routine[];

  @OneToMany(
    () => Teacher_Section,
    (teacher_section) => teacher_section.section,
    { cascade: true }
  )
  teacher_Section: Teacher_Section[];

  @OneToMany(() => Module_Section, (moduleSection) => moduleSection.section, {
    cascade: true,
  })
  moduleSection: Module_Section[];

  @OneToMany(() => Attendance, (attendance) => attendance.section)
  attendances: Attendance[];

  @ManyToOne(() => Room, (room) => room.section, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "room_id" })
  room: Room;

  @OneToMany(() => ExamRoutine, (examRoutines) => examRoutines.section, {
    cascade: true,
  })
  examRoutines: ExamRoutine;
}
