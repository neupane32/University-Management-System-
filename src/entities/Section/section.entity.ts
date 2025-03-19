import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import Base from "../../entities/base.entity";
import { University } from "../../entities/university/university.entity";
import { Program } from "../../entities/Programs/program.entity";
import { Student } from "../../entities/student/student.entity";
import { Routine } from "../../entities/Routine/routine.entity";
import { Module } from "../../entities/module/module.entity";
import { Teacher } from "../../entities/teacher/teacher.entity";
import { Resource } from "../../entities/resources/resource.entity";


@Entity("section")
export class Section extends Base {

    @Column()
    name:string;

    @ManyToOne(() => University, (university) => university.sections, {onDelete: "CASCADE"})
    @JoinColumn({name: "university_id"})
    university: University;

    @ManyToOne(() => Program, (program) => program.sections, {onDelete: "CASCADE"})
    @JoinColumn({name: "program_id"})
    program: Program;

    @ManyToOne(() => Module, (module) => module.section, {onDelete: "CASCADE"})
    @JoinColumn({name: "module_id"})
    module: Module;

    @ManyToOne(() => Teacher, (teacher) => teacher.section, {onDelete: "CASCADE"})
    @JoinColumn({name: "teacher_id"})
    teacher: Teacher;

    @OneToMany(() => Student, (student) => student.section, { cascade: true })
    students: Student[];

    @OneToMany(() => Resource, (resource) => resource.section, {cascade: true})
    resource: Resource[];

    @OneToMany(() => Routine, (routine) => routine.section, {cascade: true})
    routine: Routine[];
}