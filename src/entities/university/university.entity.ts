import { Module } from "../../entities/module/module.entity";
import { Role } from "../../constant/enum";
import Base from "../../entities/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Teacher } from "../../entities/teacher/teacher.entity";
import { Resource } from "../../entities/resources/resource.entity";
import { Student } from "../../entities/student/student.entity";
import { Routine } from "../../entities/Routine/routine.entity";
import { Announcement } from "../../entities/announcement/announcement.entity";
import { Program } from "../../entities/Programs/program.entity";
import { Section } from "../../entities/Section/section.entity";

@Entity('University')
export class University extends Base {

    @Column({nullable: true})
    profileImagePath: string

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
    

    @OneToMany(() => Program, (Program) => Program.university, {cascade: true})
    program: Program;

    @OneToMany(() => Section, (sections) => sections.university, {cascade: true})
    sections: Section;

    @OneToMany(() => Module, (module) => module.university, {cascade: true})
    module: Module;

    @OneToMany(() => Teacher, (teacher) => teacher.university, {cascade: true})
    teacher: Teacher;

    @OneToMany(() => Student, (student) => student.uni, {cascade: true})
    student: Student;

    @OneToMany(() => Announcement, (announcement) => announcement.university, {cascade:true})
    announcement: Announcement;

    @OneToMany(() => Routine, (routine) => routine.university, { cascade:true })
    routine: Routine;
    

}