import { University } from "../../entities/university/university.entity";
import { Role } from "../../constant/enum";
import Base from "../../entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Resource } from "../../entities/resources/resource.entity";
import { Module } from "../../entities/module/module.entity";
import { Announcement } from "../../entities/announcement/announcement.entity";
import { Assignment } from "../../entities/Assignment/assignment.entity";
import { Program } from "../../entities/Programs/program.entity";
import { Routine } from "../../entities/Routine/routine.entity";
import { Section } from "../../entities/Section/section.entity";
import { Teacher_Module } from "../../entities/TeacherModule/teacherModule.entity";
import { Teacher_Section } from "../../entities/TeacherSection/TeacherSection.entity";

@Entity('teacher')
export class Teacher extends Base {
  @Column()
  name: string;

  @Column({
    unique: true,
    nullable: false
  })
  email: string;

  @Column({
    select: false,
    nullable: false
  })
  password: string

  @Column()
  contact: string;

  @Column()
  gender: string;
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.TEACHER,
  })
  role: Role;

  @Column({name: 'active', default: false })
  active:boolean;

  @ManyToOne(()=> University, (university) => university.teacher, {onDelete: 'CASCADE' })
  @JoinColumn({name: 'uni_id'})
  university: University;

   @OneToMany(() => Resource, (resource) => resource.teacher, { cascade: true })
    resources: Resource[];

    @OneToMany(() => Announcement, (announce) => announce.teacher, {cascade: true})
    announcement: Announcement[];

    @OneToMany(()=> Assignment, (assignment) => assignment.teacher, {cascade: true})
    assignments: Assignment;

    @OneToMany(() => Teacher_Section, (teacher_section) => teacher_section.teacher, {cascade: true})
    teacher_section: Teacher_Section;

    @OneToMany(() => Teacher_Module, (teacher_module) => teacher_module.teacher, { cascade: true })
    teacher_module: Teacher_Module[];

    @OneToMany(() => Routine, (routines) => routines.teacher, {onDelete: "CASCADE"})
    routines: Routine[];
  



}
