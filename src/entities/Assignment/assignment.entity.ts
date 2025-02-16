import { timeStamp } from "console";
import Base from "../../entities/base.entity";
import { basename } from "path";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Teacher } from "../../entities/teacher/teacher.entity";
import { Module } from "../../entities/module/module.entity";
import { submitAssignmnet } from "./submitAssignment.entity";

@Entity('Assignment')
export class Assignment extends Base {
    @Column()
    title: string;

    @Column({nullable: true})
    description: string;

    @Column({ type: "timestamp"})
    due_date: Date;

    @ManyToOne(() => Teacher, (teacher) => teacher.assignments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "teacher_id" })
    teacher: Teacher;

    @ManyToOne(() => Module, (module) => module.assignments, {onDelete: "CASCADE"})
    @JoinColumn({name: "module_id"})
    module: Module;

    @OneToMany(() => submitAssignmnet, submission => submission.assignment)
    submissions: submitAssignmnet[];
}