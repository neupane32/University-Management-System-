import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Assignment } from "./assignment.entity";
import { Student } from "../../entities/student/student.entity";
import Base from "../../entities/base.entity";
import { Student_Assignment } from "./student_assignment.entity";

@Entity()
export class submitAssignmnet extends Base{
    
    @Column()
    submission_desc: string;

    @ManyToOne(() => Assignment, (assignment) => assignment.submissions, {onDelete: 'CASCADE'})
    @JoinColumn({name: "assignmnet_id"})
    assignment: Assignment;
    
    @OneToMany(() => Student_Assignment, (student) => student.assignment, {onDelete: 'CASCADE'})
    submissions: Student_Assignment;

    

}