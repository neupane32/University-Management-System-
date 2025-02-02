import { University } from "../../entities/university/university.entity";
import { Role } from "../../constant/enum";
import Base from "../../entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity('teacher')
export class Teacher extends Base {
  @Column()
  name: string;

  @Column({
    unique: true,
    nullable: false
  })
  email: string;

  @Column({
    select: false,
    nullable: false
  })
  password: string

  @Column()
  contact: string;

  @Column()
  gender: string;


  @Column({
    type: 'enum',
    enum: Role,
    default: Role.TEACHER,
  })
  role: Role;

  @Column({name: 'active', default: false })
  active:boolean;

  @ManyToOne(()=> University, (university) => university.teacher, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({name: 'uni_id'})
  university: University;


}
