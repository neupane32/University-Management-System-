import { Teacher } from "../../entities/teacher/teacher.entity";
import Base from "../../entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Module } from "../../entities/module/module.entity";


@Entity('Announcement')

export class Announcement extends Base {
    @Column()
    announce_name: string;

    @Column()
    annoounce_title: string;

    @Column()
    announce_date: Date;

    @ManyToOne(() => Teacher, (teacher) => teacher.announcement, {onDelete: 'CASCADE'})
    @JoinColumn({name:'teacher_id'})
    teacher: Teacher;

    @ManyToOne(() => Module, (module) => module.announce, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'module_id'})
    module: Module;
}