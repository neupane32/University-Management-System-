import Base from "../../entities/base.entity";
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { University } from "../../entities/university/university.entity";
import { Subscription } from "../Subscription/subscription.entity";
@Entity("UniversitySubscription")
export class UniversitySubscription extends Base {
  @ManyToOne(() => University, (university) => university.subscriptions, { nullable: false })
  @JoinColumn({ name: "university_id" })
  university: University;

  @ManyToOne(() => Subscription, (subscription) => subscription.universitySubscriptions, { nullable: false })
  @JoinColumn({ name: "subscription_id" })
  subscription: Subscription;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  startDate: Date;

  @Column({ type: "timestamp", nullable: true })
  endDate: Date;

  @Column({ default: false })
  isActive: boolean;
}
