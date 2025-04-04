import Base from "../../entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Section } from "../../entities/Section/section.entity";
import { Module } from "../../entities/module/module.entity";

@Entity('module_section')
export class Module_Section extends Base {

  @ManyToOne(() => Section, (section) => section.moduleSection, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @ManyToOne(() => Module, (module) => module.moduleSection, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'module_id' })
  module: Module;

}
