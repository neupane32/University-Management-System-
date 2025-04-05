import { timeStamp } from "console";
import Base from "../../entities/base.entity";
import { basename } from "path";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Teacher } from "../../entities/teacher/teacher.entity";
import { Module } from "../../entities/module/module.entity";
import { submitAssignmnet } from "./submitAssignment.entity";
import { Assignment_File } from "./assignmentfile.entity";
import { AssignmentStatus } from "../../constant/enum";

@Entity('Assignment')
export class Assignment extends Base {
    @Column()
    title: string;

    @Column({nullable: true})
    description: string;

    @Column({ type: "timestamp"})
    due_date: Date;


    @Column({ enum:AssignmentStatus, default:AssignmentStatus.OPEN})
    status: AssignmentStatus;

    @ManyToOne(() => Teacher, (teacher) => teacher.assignments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "teacher_id" })
    teacher: Teacher;



    @ManyToOne(() => Module, (module) => module.assignments, {onDelete: "CASCADE"})
    @JoinColumn({name: "module_id"})
    module: Module;

    @OneToMany(() => submitAssignmnet, submission => submission.assignment)
    submissions: submitAssignmnet[];

    @OneToMany(() => Assignment_File, files => files.assignment)
    files: Assignment_File[];
}