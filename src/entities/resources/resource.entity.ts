import { Module } from "../../entities/module/module.entity";
import Base from "../../entities/base.entity";
import {Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Teacher } from "../../entities/teacher/teacher.entity";
import { Section } from "../../entities/Section/section.entity";
import { Notification } from "../../entities/notification/notification.entity";


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

  @OneToMany(() => Notification, (notification) => notification.resource, {
    onDelete: "CASCADE",
  })
  notification: Notification[];

}