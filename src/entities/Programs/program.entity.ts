import { University } from "../../entities/university/university.entity";
import Base from "../../entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Module } from "../../entities/module/module.entity";
import { DurationType } from "../../constant/enum";
import { Section } from "../../entities/Section/section.entity";
import { ExamRoutine } from "../../entities/Routine/exam_routine.entity";


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

     @OneToMany(() => ExamRoutine, (examRoutines) => examRoutines.university, { cascade:true })
    examRoutines: ExamRoutine;

    @OneToMany(() => Module, (module) => module.program, { cascade: true })
    module: Module;

}
