import { University } from "../../entities/university/university.entity";
import { Program } from "../../entities/Programs/program.entity";
import Base from "../../entities/base.entity";
import {Column, Entity, JoinColumn, ManyToOne,OneToMany} from "typeorm";
import { Resource } from "../../entities/resources/resource.entity";
import { Announcement } from "../../entities/announcement/announcement.entity";
import { Assignment } from "../../entities/Assignment/assignment.entity";
import { Teacher_Module } from "../../entities/TeacherModule/teacherModule.entity";
import { Module_Section } from "../../entities/ModuleSection/ModuleSection.entity";
import { ExamRoutine } from "../../entities/Routine/exam_routine.entity";

@Entity("module")
export class Module extends Base {
  @Column()
  name: string;

  @Column()
  module_code: string;

  @ManyToOne(() => Program, (Program) => Program.module, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "program_id" })
  program: Program;

  @ManyToOne(() => University, (university) => university.module, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "uni_id" })
  university: University;

  @Column("int", { nullable: true })
  durationReference: number;

  @OneToMany(() => Resource, (resource) => resource.module, { cascade: true })
  module: Resource[];

  @OneToMany(() => Announcement, (announce) => announce.module, {
    cascade: true,
  })
  announce: Announcement[];

  @OneToMany(() => Assignment, (assignment) => assignment.module, {
    cascade: true,
  })
  assignments: Assignment[];

  @OneToMany(() => ExamRoutine, (examRoutines) => examRoutines.university, {
    cascade: true,
  })
  examRoutines: ExamRoutine;

  @OneToMany(() => Teacher_Module, (teacherModule) => teacherModule.module, {
    cascade: true,
  })
  modules: Teacher_Module[];

  @OneToMany(() => Module_Section, (moduleSection) => moduleSection.module, {
    cascade: true,
  })
  moduleSection: Module_Section[];

  @OneToMany(() => Module, (routine) => routine.module, { onDelete: "CASCADE" })
  routine: Module;
  resource: any;
}
