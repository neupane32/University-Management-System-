import { Teacher } from "../teacher/teacher.entity";
import Base from "../base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Module } from "../module/module.entity";
import { University } from "../university/university.entity";
import { Section } from "../../entities/Section/section.entity";
import { Notification } from "../../entities/notification/notification.entity";


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

  @ManyToOne(() => Section, (section) => section.routine, {onDelete: "CASCADE"})
  @JoinColumn({name: "section_id"})
  section: Section;
  @ManyToOne(() => Module, (module) => module.routine, {onDelete: "CASCADE"})
  @JoinColumn({name: "module_id"})
  module: Module;

  @ManyToOne(() => Teacher, (teacher) => teacher.routines, { onDelete: "CASCADE" })
@JoinColumn({ name: "teacher_id" })
teacher: Teacher;
 
  @OneToMany(() => Notification, (notification) => notification.routine, {
    onDelete: "CASCADE",
  })
  notification: Notification[];


  
}