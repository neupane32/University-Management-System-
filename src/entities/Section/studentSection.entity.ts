import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import Base from "../../entities/base.entity";
import { University } from "../../entities/university/university.entity";
import { Program } from "../../entities/Programs/program.entity";
import { Student } from "../../entities/student/student.entity";


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

    @OneToMany(() => Student, (student) => student.section, { cascade: true })
    students: Student[];
    
}