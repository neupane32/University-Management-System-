import { Module } from "../../entities/module/module.entity";
import { MediaType } from "../../constant/enum";
import Base from "../../entities/base.entity";
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import path from "path";
import fs from 'fs';
import { getTempFolderPath, getUploadFolderpath } from "../../utils/path.utils";
import { DotenvConfig } from "../../config/env.config";
import { Teacher } from "../../entities/teacher/teacher.entity";
import { Section } from "../../entities/Section/section.entity";
import { Assignment } from "./assignment.entity";
import { Student_Assignment } from "./student_assignment.entity";


@Entity('submission_file')

export class Submission_File extends Base{

@Column({nullable:true})
title: string;

@Column()
filePath: string

@ManyToOne(() => Student_Assignment, (submisson) => submisson.files, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'submisson_id' })
submisson: Student_Assignment;




}