import { University } from "../../entities/university/university.entity";
import { Program } from "../../entities/Programs/program.entity";
import Base from "../../entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity('module')
export class Module extends Base {
    @Column()
    name: string;

    @Column()
    module_code: string;

    @ManyToOne(() => Program, (Program) => Program.module, { onDelete: 'CASCADE'})
    @JoinColumn({ name: 'program_id'})
    program: Program;

    @ManyToOne(() => University, (university) => university.module, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'uni_id'})
    university: University;

}