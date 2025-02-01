import { University } from "../../entities/university/university.entity";
import Base from "../../entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Module } from "../../entities/module/module.entity";

@Entity('Program')
export class Program extends Base {
    @Column()
    name:string;

    @Column()
    duration: string;



    @ManyToOne(()=> University, (university) => university.program, { onDelete: 'CASCADE'})
    @JoinColumn({name: 'university_id'})
    university: University;

    @OneToMany(() => Module, (module) => module.program, {cascade: true})
    module: Module;

}