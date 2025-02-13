import { University } from "../../entities/university/university.entity";
import { Role } from "../../constant/enum";
import Base from "../../entities/base.entity";
import { Column, Entity, OneToOne, ManyToOne, JoinColumn } from "typeorm";
import { StudentDetails } from "./studentDetails.entity";

@Entity("studnet")
export class Student extends Base {
  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    unique: true,
  })
  username: string;

  @Column({ select: false, nullable: false })
  password: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.STUDNET,
  })
  role: Role;

  @Column({ name: "active", default: false })
  active: boolean;

  @ManyToOne(() => University, (uni) => uni.student, {
    onDelete: "CASCADE" })
  @JoinColumn({ name: "uni_id" })
  uni: University;

  @OneToOne(() => StudentDetails, (details) => details.student, {
    cascade: true,
  })
  details: StudentDetails;
}
