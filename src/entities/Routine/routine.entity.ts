import { Teacher } from "../teacher/teacher.entity";
import Base from "../base.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, UpdateDateColumn } from "typeorm";
import { Module } from "../module/module.entity";
import { University } from "../university/university.entity";
import { Student } from "../student/student.entity";
import { Section } from "../../entities/Section/section.entity";
import { Teacher_Module } from "../../entities/TeacherModule/teacherModule.entity";


@Entity("Routine")
export class Routine extends Base {
  @Column()
  day: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @ManyToOne(() => University, (university) => university.routine, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "university_id" })
  university: University;

  // @ManyToOne(() => Program, (program) => program.routine, { onDelete: "CASCADE", nullable: true })
  // @JoinColumn({ name: "program_id" })
  // program: Program;

  @ManyToOne(() => Section, (section) => section.routine, {onDelete: "CASCADE"})
  @JoinColumn({name: "section_id"})
  section: Section;
  @OneToOne(() => Module, (module) => module.routine, {onDelete: "CASCADE"})
  @JoinColumn({name: "module_id"})
  module: Module;
 


  
}