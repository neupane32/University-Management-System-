import { University } from "../../entities/university/university.entity";
import { Role } from "../../constant/enum";
import Base from "../../entities/base.entity";
import { Column, Entity, OneToOne,OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { StudentDetails } from "./studentDetails.entity";
import { Routine } from "../../entities/Routine/routine.entity";
import { Program } from "../../entities/Programs/program.entity";
import { Section } from "../../entities/Section/section.entity";

@Entity("studnet")
export class Student extends Base {
  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({ select: false, nullable: false })
  password: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.STUDNET,
  })
  role: Role;

  @Column({
    nullable: true
  })
  year: number;

  @Column({
    nullable: true
  })
  semester: number;


  @ManyToOne(() => University, (uni) => uni.student, {
    onDelete: "CASCADE" })
    
  @JoinColumn({ name: "uni_id" })
  uni: University;

  @OneToOne(() => StudentDetails, (details) => details.student, {
    cascade: true,
  })
  details: StudentDetails;

  @ManyToOne(() => Program, (program) => program.student , { onDelete: "CASCADE"})
  @JoinColumn({name: "prog_id"})
  program: Program;

  @ManyToOne(() => Section, (section) => section.students , { onDelete: "CASCADE"})
  @JoinColumn({name: "section_id"})
  section: Section;

  // @OneToMany(() => Routine, (routine) => routine.student, {cascade: true})
  //   routine : Routine;
}
