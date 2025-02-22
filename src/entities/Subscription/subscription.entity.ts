import Base from "../../entities/base.entity";
import { Entity, Column } from "typeorm";

@Entity("Subscription")
export class Subscription extends Base {
  @Column({
    unique: true,
    nullable: false,
  })
  title: string;

  @Column({
    unique: true,
    type: 
    'float'
  })
  duration: number;

  @Column({
    unique: true,
    type: 
    'float'
  })
  bonus: number;

  @Column({ select: false, nullable: false, default: false })
  mostPoopular: boolean;
}