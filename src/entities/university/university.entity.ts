import { Module } from "../../entities/module/module.entity";
import { Role } from "../../constant/enum";
import Base from "../../entities/base.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('University')
export class University extends Base {
    @Column({
        unique: true,
        nullable: false,
    })
    email: string


    @Column({name: "University_name"})
    universityName: string;

    @Column({select: false, nullable: false})
    password: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.UNIVERSITY,
    })
    role: Role;

    @Column({ name: 'verified', default: false })
    Verified: boolean;
  
  
    @Column({ name: 'otp', nullable: true })
    otp: string;
  
    @Column({ name: 'payment_verified', default: false, nullable: true })
    payment_verified: boolean;
    program: any;


    @OneToMany(() => Module, (module) => module.university, {cascade: true})
    module: Module;

}