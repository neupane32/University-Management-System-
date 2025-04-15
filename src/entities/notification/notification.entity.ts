import { University } from "../../entities/university/university.entity";
import Base from "../../entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import { Teacher } from "../../entities/teacher/teacher.entity";
import { Student } from "../../entities/student/student.entity";
import { NotificationType } from "../../constant/enum";
import { Assignment } from "../../entities/Assignment/assignment.entity";
import { Announcement } from "../../entities/announcement/announcement.entity";
import { Resource } from "../../entities/resources/resource.entity";
import { Routine } from "../../entities/Routine/routine.entity";


@Entity("Notification")
export class Notification extends Base {
  @Column()
  message: string;

  @Column({ type: "enum", enum: NotificationType })
  type: NotificationType;

  @Column({ default: false })
  isRead: boolean;


  @ManyToOne(() => University, (university) => university.program, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "university_id" })
  university: University;

  @ManyToOne(() => Teacher, (teacher) => teacher.notification, { onDelete: "CASCADE"})
  @JoinColumn({ name: "teacher_id" })
  teacher: Teacher;

  @ManyToOne(() => Student, (student) => student.notification, { onDelete: "CASCADE"})
  @JoinColumn({ name: "student_id" })
  student: Student;

  @ManyToOne(() => Assignment, (assignment) => assignment.notification, { onDelete: "CASCADE"})
  @JoinColumn({ name: "assignment_id" })
  assignment: Assignment;
  
  @ManyToOne(() => Announcement, (announcement) => announcement.notification, { onDelete: "CASCADE"})
  @JoinColumn({ name: "announcement_id" })
  announcement: Announcement;

  @ManyToOne(() => Resource, (resource) => resource.notification, { onDelete: "CASCADE"})
  @JoinColumn({ name: "resource_id" })
  resource: Resource;


  @ManyToOne(() => Routine, (routine) =>routine.notification, { onDelete: "CASCADE"})
  @JoinColumn({ name: "routine_id" })
  routine: Routine;

}
