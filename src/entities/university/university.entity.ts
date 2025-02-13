import { Module } from "../../entities/module/module.entity";
import { Role } from "../../constant/enum";
import Base from "../../entities/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Teacher } from "../../entities/teacher/teacher.entity";
import { Resource } from "../../entities/resources/resource.entity";
import { Student } from "../../entities/student/student.entity";
import { ExamRoutine } from "../../entities/examRoutine/examRoutine.entity";

@Entity('University')
export class University extends Base {
    @Column({
        unique: true,
        nullable: false,
    })
    email: string


    @Column({name: "University_name"})
    universityName: string;

    @Column({select: false, nullable: false})
    password: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.UNIVERSITY,
    })
    role: Role;

    @Column({ name: 'verified', default: false })
    Verified: boolean;
  
  
    @Column({ name: 'otp', nullable: true })
    otp: string;
  
    @Column({ name: 'payment_verified', default: false, nullable: true })
    payment_verified: boolean;
    program: any;


    @OneToMany(() => Module, (module) => module.university, {cascade: true})
    module: Module;

    @OneToMany(() => Teacher, (teacher) => teacher.university, {cascade: true})
    teacher: Teacher;

    @OneToMany(() => Student, (student) => student.uni, {cascade: true})
    student: Student;

    @OneToMany(() => ExamRoutine, (routine) => routine.university, {onDelete: "CASCADE"})
    routine: ExamRoutine;

}