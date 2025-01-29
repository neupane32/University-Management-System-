import { Role } from '../constant/enum';
import Base from '../entities/base.entity';
import {
  Column,
  Entity,
  OneToOne,
  OneToMany,
  Tree,
  TreeParent,
  TreeChildren,
} from 'typeorm';

@Entity('admin')
export class Admin extends Base {
  @Column({
    unique: true
  })
  email: string;

  @Column({ select: false})
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.ADMIN,
  })
  role: Role;
}
