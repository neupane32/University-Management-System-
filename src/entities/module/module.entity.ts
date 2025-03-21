import { University } from "../../entities/university/university.entity";
import { Program } from "../../entities/Programs/program.entity";
import Base from "../../entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Resource } from "../../entities/resources/resource.entity";
import { Teacher } from "../../entities/teacher/teacher.entity";
import { Announcement } from "../../entities/announcement/announcement.entity";
import { Assignment } from "../../entities/Assignment/assignment.entity";
import { Section } from "../../entities/Section/section.entity";
import { Teacher_Module } from "../../entities/TeacherModule/teacherModule.entity";


@Entity('module')
export class Module extends Base {
    [x: string]: any;
    @Column()
    name: string;

    @Column()
    module_code: string;

    @ManyToOne(() => Program, (Program) => Program.module, { onDelete: 'CASCADE'})
    @JoinColumn({ name: 'program_id'})
    program: Program;

    @ManyToOne(() => University, (university) => university.module, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'uni_id'})
    university: University;

    @Column('int')
    durationReference: number;

    @OneToMany(() => Resource, (resource) => resource.module, {cascade: true})
    module: Module[];

    @OneToMany(() => Announcement, (announce) => announce.module, {cascade: true })
    announce: Announcement[];

    @OneToMany(()=> Assignment, (assignment)=> assignment.module, {cascade: true})
    assignments: Assignment[];

    @OneToMany(()=> Section, (section)=> section.module, {cascade: true})
    section: Section[];

     @OneToMany(() => Teacher_Module, (modules) => modules.teacher, { cascade: true })
      modules: Teacher_Module[];

    


}