import { Teacher } from "../teacher/teacher.entity";
import Base from "../base.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { Module } from "../module/module.entity";
import { University } from "../university/university.entity";
import { Student } from "../student/student.entity";
import { Section } from "../../entities/Section/section.entity";


@Entity("Routine")
export class Routine extends Base {
  @Column()
  day: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.routine, { onDelete: "CASCADE" })
  @JoinColumn({ name: "teacher_id" })
  teacher: Teacher;

  @ManyToOne(() => Module, (module) => module.routine, { onDelete: "CASCADE" })
  @JoinColumn({ name: "module_id" })
  module: Module;

  @ManyToOne(() => University, (university) => university.routine, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "university_id" })
  university: University;

  @ManyToOne(() => Section, (section) => section.routine, {onDelete: "CASCADE"})
  section: Section;
}