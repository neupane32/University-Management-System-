import { Teacher } from "../teacher/teacher.entity";
import Base from "../base.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { Module } from "../module/module.entity";
import { University } from "../university/university.entity";
import { RoutineStatus, RoutineType } from "../../constant/enum";
import { Student } from "../student/student.entity";


@Entity("Routine")
export class Routine extends Base {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: "date" })
  start_date: Date;

  @Column({type: "date"})
  end_date: Date;

  @Column({ type: "enum", enum: RoutineType })
  type: RoutineType;

  @Column({ type: "enum", enum: RoutineStatus, default: RoutineStatus.PENDING })
  status: RoutineStatus;

  // @ManyToOne(() => Teacher, (teacher) => teacher.routine, { onDelete: "CASCADE" })
  // @JoinColumn({ name: "teacher_id" })
  // teacher: Teacher;

  @ManyToOne(() => Module, (module) => module.examRoutines, { onDelete: "CASCADE" })
  @JoinColumn({ name: "module_id" })
  module: Module;

  @ManyToOne(() => University, (university) => university.examRoutines, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "approved_by" })
  approved_by: University | null;

  @ManyToOne(()=> Student, (student) => student.routine, {onDelete: "CASCADE"})
  @JoinColumn({name: "student_id"})
  student: Student;
}