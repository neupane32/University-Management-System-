import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Assignment } from "./assignment.entity";
import { Student } from "../../entities/student/student.entity";
import Base from "../../entities/base.entity";
import { submitAssignmnet } from "./submitAssignment.entity";
import { Submission_File } from "./submission_file.entity";

@Entity("student_assignment")
export class Student_Assignment extends Base {
  @ManyToOne(() => submitAssignmnet, (assignment) => assignment.submissions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "assignmnet_id" })
  assignment: submitAssignmnet;

  @ManyToOne(() => Student, (student) => student.submission, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "student_id" })
  student: submitAssignmnet;

    @OneToMany(() => Submission_File, files => files.submisson)
      files: Submission_File[];
}
