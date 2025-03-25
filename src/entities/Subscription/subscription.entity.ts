import Base from "../../entities/base.entity";
import { Entity, Column } from "typeorm";

@Entity("Subscription")
export class Subscription extends Base {
  @Column({

    nullable: false,
  })
  title: string;

  @Column({
   
    type: 
    'float'
  })
  duration: number;

  @Column({
   
    type: 
    'float'
  })
  price: number;


  @Column({
    
    type: 
    'float'
  })
  bonus: number;

  @Column({  nullable: false, default: false })
  mostPopular: boolean;
}