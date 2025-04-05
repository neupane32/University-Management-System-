import Base from "../../entities/base.entity";
import {  Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Assignment } from "./assignment.entity";

@Entity('assignment_file')
export class Assignment_File extends Base{

@Column()
filePath: string
@Column()
fileName: string

@ManyToOne(() => Assignment, (assignment) => assignment.files, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'assignment_id' })
assignment: Assignment;



}