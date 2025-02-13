import { Teacher } from "../../entities/teacher/teacher.entity";
import Base from "../../entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Module } from "../../entities/module/module.entity";
import { University } from "../../entities/university/university.entity";

@Entity("ExamRoutine")
export class ExamRoutine extends Base {
  [x: string]: any;
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: "date" })
  exam_date: Date;

  @Column({ name: "verified", default: false })
  Verified: boolean;

  @ManyToOne(()=> Teacher, (teacher) => teacher.routine , {onDelete: "CASCADE"})
  @JoinColumn({ name: "teacher_id"})
  teacher: Teacher;

  @ManyToOne(() => Module, (module) => module.examRoutines, { onDelete: "CASCADE" })
  @JoinColumn({ name: "module_id" })
  module: Module;

  @ManyToOne(() => University, (university) => university.routine, {onDelete: "CASCADE"})
  @JoinColumn({ name: "approved_by" })
  approved_by: University;


  
}
