import Base from "../../entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Teacher } from "../../entities/teacher/teacher.entity";
import { Section } from "../../entities/Section/section.entity";

@Entity('teacher_section')
export class Teacher_Section extends Base {
 

  @ManyToOne(() => Section, (section) => section.teacher_Section, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @ManyToOne(() => Teacher, (teacher) => teacher.teacher_module, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teacher;

}
