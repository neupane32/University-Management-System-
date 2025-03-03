import { AfterLoad, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import Base from "../base.entity";
import { Gender } from "../../constant/enum";
import { Student } from "./student.entity";
@Entity("student_details")
export class StudentDetails extends Base {
  @Column({ name: "first_name", nullable: false })
  first_name: string;

  @Column({ name: "middle_name", nullable: true })
  middle_name: string;

  @Column({ name: "last_name" })
  last_name: string;

  @Column({ name: "phone_number", nullable: true })
  phone_number: string;

  @Column({ name: "DOB" })
  DOB: string;

  @Column({ type: "enum", enum: Gender })
  gender: Gender;

  @Column()
     admissionYear: number;

  @OneToOne(() => Student, (student) => student.details, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "student_id" })
  student: Student;
}
