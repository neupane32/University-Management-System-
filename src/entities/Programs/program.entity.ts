import { University } from "../../entities/university/university.entity";
import Base from "../../entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity('Program')
export class Program extends Base {
    @Column()
    name:string;

    @Column()
    duration: string;



    @ManyToOne(()=> University, (university) => university.program, { onDelete: 'CASCADE'})
    @JoinColumn({name: 'university_id'})
    university: University;

}