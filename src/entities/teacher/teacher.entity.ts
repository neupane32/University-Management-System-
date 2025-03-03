import { University } from "../../entities/university/university.entity";
import { Role } from "../../constant/enum";
import Base from "../../entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Resource } from "../../entities/resources/resource.entity";
import { Module } from "../../entities/module/module.entity";
import { Announcement } from "../../entities/announcement/announcement.entity";
import { Assignment } from "../../entities/Assignment/assignment.entity";
import { ExamRoutine } from "../../entities/examRoutine/examRoutine.entity";
import { Program } from "../../entities/Programs/program.entity";

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

  @ManyToOne(() => Module, (module) => module.teacher, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'module_id' })
  module: Module;

  
  @ManyToOne(() => Program, (program) => program.teacher, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'program_id' })
  program: Program;

   @OneToMany(() => Resource, (resource) => resource.teacher, { cascade: true })
    resources: Resource[];

    @OneToMany(() => Announcement, (announce) => announce.teacher, {cascade: true})
    announcement: Announcement[];

    @OneToMany(()=> Assignment, (assignment) => assignment.teacher, {cascade: true})
    assignments: Assignment;

    @OneToMany(() => ExamRoutine, (routine) => routine.teacher, {cascade: true})
    routine: ExamRoutine;





}
