import { University } from "../../entities/university/university.entity";
import Base from "../../entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Module } from "../../entities/module/module.entity";
import { Teacher } from "../../entities/teacher/teacher.entity";
import { Student } from "../../entities/student/student.entity";

@Entity('Program')
export class Program extends Base {
    @Column()
    name:string;

    @Column()
    duration: string;



    @ManyToOne(()=> University, (university) => university.program, { onDelete: 'CASCADE'})
    @JoinColumn({name: 'university_id'})
    university: University;

    @OneToMany(() => Module, (module) => module.program, {cascade: true})
    module: Module;

    @OneToMany(() => Student, (Student) => Student.program, {cascade: true})
    student: Student;

    @OneToMany(() => Teacher, (teacher) => teacher.program, {cascade: true})
    teacher: Teacher;

}