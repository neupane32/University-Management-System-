import Base from "../../entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Student_Assignment } from "./student_assignment.entity";


@Entity('submission_file')

export class Submission_File extends Base{

@Column({nullable:true})
title: string;

@Column()
fileName: string

@Column()
filePath: string

@ManyToOne(() => Student_Assignment, (submisson) => submisson.files, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'submisson_id' })
submisson: Student_Assignment;




}