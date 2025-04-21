import { Teacher } from "../../entities/teacher/teacher.entity";
import { Student } from "../../entities/student/student.entity";
import  Base  from "../../entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity('chat')
export class Chat extends Base {
@Column()
message: string;
@ManyToOne(() => Teacher, teacher => teacher.sentChats, { nullable: true, onDelete: 'CASCADE' })
@JoinColumn({ name: 'teacherSenderId' })
teacherSender?: Teacher;

@ManyToOne(() => Student, student => student.sentChats, { nullable: true, onDelete: 'CASCADE' })
@JoinColumn({ name: 'studentSenderId' })
studentSender?: Student;

@ManyToOne(() => Teacher, teacher => teacher.receivedChats, { nullable: true, onDelete: 'CASCADE' })
@JoinColumn({ name: 'teacherReceiverId' })
teacherReceiver?: Teacher;

@ManyToOne(() => Student, student => student.receivedChats, { nullable: true, onDelete: 'CASCADE' })
@JoinColumn({ name: 'studentReceiverId' })
studentReceiver?: Student;


}