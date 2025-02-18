import { Teacher } from "../../entities/teacher/teacher.entity";
import Base from "../../entities/base.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { Module } from "../../entities/module/module.entity";
import { University } from "../../entities/university/university.entity";

export enum RoutineStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected"
}

@Entity("ExamRoutine")
export class ExamRoutine extends Base {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: "date" })
  exam_date: Date;

  @Column({ type: "enum", enum: RoutineStatus, default: RoutineStatus.PENDING })
  status: RoutineStatus;

  @ManyToOne(() => Teacher, (teacher) => teacher.routine, { onDelete: "CASCADE" })
  @JoinColumn({ name: "teacher_id" })
  teacher: Teacher;

  @ManyToOne(() => Module, (module) => module.examRoutines, { onDelete: "CASCADE" })
  @JoinColumn({ name: "module_id" })
  module: Module;

  @ManyToOne(() => University, (university) => university.examRoutines, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "approved_by" })
  approved_by: University | null;
}