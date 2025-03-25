import { Role } from "../../constant/enum";
import Base from "../../entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
@Entity('admin')
export class Admin extends Base {
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
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.ADMIN,
  })
  role: Role;
  @Column({name: 'active', default: false })
  active:boolean;
}
