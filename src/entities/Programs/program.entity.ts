import { University } from "../../entities/university/university.entity";
import Base from "../../entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Module } from "../../entities/module/module.entity";
import { Teacher } from "../../entities/teacher/teacher.entity";
import { Student } from "../../entities/student/student.entity";
import { DurationType } from "../../constant/enum";
import { Section } from "../../entities/Section/section.entity";
import { Routine } from "../../entities/Routine/routine.entity";


@Entity('Program')
export class Program extends Base {
    @Column()
    name: string;

    @Column({
        type: "enum",
        enum: DurationType,
        default: DurationType.SEMESTER
    })
    durationType: DurationType;


    @Column()
    duration: number;

    @ManyToOne(() => University, (university) => university.program, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'university_id' })
    university: University;

    @OneToMany(() => Section, (sections) => sections.program, { cascade: true })
    sections: Section[];

    // @OneToMany(() => Routine, (routine) => routine.program, { cascade: true })
    // routine: Routine[];

    @OneToMany(() => Module, (module) => module.program, { cascade: true })
    module: Module;

}
