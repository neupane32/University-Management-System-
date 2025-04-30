import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import Base from '../../entities/base.entity';
import { University } from '../../entities/university/university.entity';
import { Program } from '../../entities/Programs/program.entity';
import { Module } from '../../entities/module/module.entity';
import { Section } from '../../entities/Section/section.entity';


@Entity('exam_routine')
export class ExamRoutine extends Base {
  @Column({ type: 'date' })
  examDate: Date;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @ManyToOne(() => University, uni => uni.examRoutines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'university_id' })
  university: University;

  @ManyToOne(() => Program, program => program.examRoutines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'program_id' })
  program: Program;

  @ManyToOne(() => Module, module => module.examRoutines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'module_id' })
  module: Module;

  @ManyToOne(() => Section, section => section.examRoutines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'section_id' })
  section: Section;
}