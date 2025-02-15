import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";
import { Assignment } from "./assignment.entity";



@Entity()
export class AssignmentEntity{
    @Column()
    submission_desc: string;

    @Column({ default: () => "CURRENT_TIMESTAMP" })
    submission_date: Date;

    @ManyToOne(() => Assignment, assignment => assignment.submissions)
    @JoinColumn({ name: "assignment_id" })
    assignment: Assignment;

    

}