import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Assignment } from "./assignment.entity";

@Entity()
export class submitAssignmnet{

    @PrimaryGeneratedColumn()
    id: string;
    
    @Column()
    submission_desc: string;

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    submission_date: Date;

    @ManyToOne(() => Assignment, (assignment) => assignment.submissions, {onDelete: 'CASCADE'})
    @JoinColumn({name: "assignmnet_id"})
    assignment: Assignment;

    

}