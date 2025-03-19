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


@Entity('resource')

export class Resource extends Base{

@Column()
title: string;

@Column()
resourcePath: string

@ManyToOne(() => Module, (module) => module.resource, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'module_id' })
module: Module;

@ManyToOne(() => Section, (section) => section.resource, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'section_id' })
section: Section;

@ManyToOne(() => Teacher, (teacher) => teacher.resources, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'teacher_id' })
teacher: Teacher

}