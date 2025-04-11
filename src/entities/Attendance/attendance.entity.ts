import Base from "../../entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AttendanceStatus } from "../../constant/enum";
import { Section } from "../../entities/Section/section.entity";
import { Student } from "../../entities/student/student.entity";

@Entity('attendance')
export class Attendance extends Base {
  @ManyToOne(() => Student, (student) => student.attendances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Section, (section) => section.attendances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @Column({ type: 'date' })
  date: Date;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT
  })
  status: AttendanceStatus;
}