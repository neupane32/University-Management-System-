import { UniversitySubscription } from "../../entities/UniSubscription/unisubscription.entity";
import Base from "../../entities/base.entity";
import { Entity, Column, OneToMany } from "typeorm";

@Entity("Subscription")
export class Subscription extends Base {
  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    type: "float",
  })
  duration: number;

  @Column({
    type: "float",
  })
  price: number;

  @Column({
    type: "float",
  })
  bonus: number;

  @Column({ nullable: false, default: false })
  mostPopular: boolean;

  @OneToMany(() => UniversitySubscription, (us) => us.subscription, {
    cascade: true,
  })
  universitySubscriptions: UniversitySubscription[];
}
