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
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({name:"admin_name"})
  univeristyName: string;

  @Column({ select: false, nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.ADMIN,
  })
  role: Role;

  @Column({ name: 'verified', default: false })
  Verified: boolean;

  @Column({ name: 'otp', nullable: true })
  otp: string;
}
