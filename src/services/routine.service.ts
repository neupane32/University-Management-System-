import { University } from "../entities/university/university.entity";
import { AppDataSource } from "../config/database.config";
import { Module } from "../entities/module/module.entity";
import { RoutineInterface } from "../interface/routine.interface";
import { Routine } from "../entities/Routine/routine.entity";
import { Program } from "../entities/Programs/program.entity";
import { Teacher_Section } from "../entities/TeacherSection/TeacherSection.entity";
import { Teacher_Module } from "../entities/TeacherModule/teacherModule.entity";
import { Student } from "../entities/student/student.entity";
import { Teacher } from "../entities/teacher/teacher.entity";

class RoutineService {
    constructor (
        private readonly routineRepo = AppDataSource.getRepository(Routine),
        private readonly teacherRepo = AppDataSource.getRepository(Teacher),
        private readonly studentRepo = AppDataSource.getRepository(Student),
        private readonly uniRepo = AppDataSource.getRepository(University),
        private readonly teacherSection = AppDataSource.getRepository(Teacher_Section),
        private readonly teacherModule = AppDataSource.getRepository(Teacher_Module),
    ) {

    }
    async createRoutine ( uni_id: string, data: any){
    console.log("🚀 ~ RoutineService ~ createRoutine ~ data:", data)

      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");
      const sectionTeachers = await this.teacherSection.find({
        where: { section: { id: data.section_id } },
        relations: ["teacher"]
      });
      console.log("🚀 ~ RoutineService ~ createRoutine ~ sectionTeachers:", sectionTeachers)
    
      // Get teachers assigned to the module
      const moduleTeachers = await this.teacherModule.find({
        where: { module: { id: data.module_id } },
        relations: ["teacher"]
      });
      console.log("🚀 ~ RoutineService ~ createRoutine ~ moduleTeachers:", moduleTeachers)
    const commonTeachers = sectionTeachers.filter(sectionTeacher => 
        moduleTeachers.some(moduleTeacher => 
          moduleTeacher.teacher.id === sectionTeacher.teacher.id
        )
      );
    console.log("🚀 ~ RoutineService ~ createRoutine ~ commonTeachers:", commonTeachers)
    const primaryTeacher = commonTeachers[0].teacher;
      console.log("🚀 ~ RoutineService ~ createRoutine ~ primaryTeacher:", primaryTeacher)
      // Verify selected teacher is in both groups
   
    
        const routine =  this.routineRepo.create({
            startTime: data.startTime,
            endTime: data.endTime,
            day: data.day,
            university: uni,
            section:{
                id:data.section_id
            },
            module:{id:data.module_id},
            teacher:primaryTeacher
            
        })
        console.log("🚀 ~ RoutineService ~ createRoutine ~ routine:", routine)
       const saved= await this.routineRepo.save(routine);
       console.log("🚀 ~ RoutineService ~ createRoutine ~ saved:", saved)

        return saved;
    }

    async getRoutine(uni_id: string, section_id: string){

        const uni = await this.uniRepo.findOneBy({ id: uni_id });
        if (!uni) throw new Error("University Not found");
        console.log("🚀 ~ RoutineService ~ getRoutine ~ uni:", uni)


        const getRoutines = await this.routineRepo.createQueryBuilder("routine")
        .leftJoinAndSelect("routine.section", "section")
        .leftJoinAndSelect("section.program", "program")
        .leftJoinAndSelect("routine.teacher", "teacher")
        .leftJoinAndSelect("routine.module", "module")
        .where("section.id = :section_id", { section_id })
        .getMany();

        
        return getRoutines;
    }

    async getRoutineByStudent(student_id: string) {
    
      const student = await this.studentRepo.findOne({
        where: { id: student_id },
        relations: ['section'],
      });
      
      if (!student) {
        throw new Error("Student not found");
      }

      if (!student.section) {
        throw new Error("Student section not found");
      }
      
      const section_id = student.section.id;
  
      const routines = await this.routineRepo.createQueryBuilder("routine")
        .leftJoinAndSelect("routine.section", "section")
        .leftJoinAndSelect("section.program", "program")
        .leftJoinAndSelect("routine.teacher", "teacher")
        .leftJoinAndSelect("routine.module", "module")
        .where("section.id = :section_id", { section_id })
        .getMany();
    
      return routines;
    }
    

  async getRoutineByTeacher(teacher_id: string){

    const teacher = await this.teacherRepo.findOne({
      where: { id: teacher_id},
      relations: ['section'],
    });
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    if (!teacher.teacher_section) {
      throw new Error("Student section not found");
    }
    
    const section_id = teacher.teacher_section.id;

    const getRoutines = await this.routineRepo.createQueryBuilder("routine")
    .leftJoinAndSelect("routine.section", "section")
    .leftJoinAndSelect("section.program", "program")
    .leftJoinAndSelect("routine.teacher", "teacher")
    .leftJoinAndSelect("routine.module", "module")
    .where("section.id = :section_id", { section_id })
    .getMany();
    
    return getRoutines;
}
    async updateRoutine(uni_id: string, routine_id: string, data: any){
        const uni = await this.uniRepo.findOneBy({ id: uni_id });
        if (!uni) throw new Error("University Not found");

        const routine = await this.routineRepo.findOneBy({ id: routine_id });
        if (!routine) throw new Error("Routine Not found");

        const updateRoutine = await this.routineRepo.update(
            { id: routine_id
            },
            {
                startTime: data.startTime,
                endTime: data.endTime,
                day: data.day,
                section: {
                    id:data.section_id
                }
            }
        );
        return updateRoutine;
    }

    async deleteRoutine(uni_id:string, routine_id:string){
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("Uni not found");

      const routine= await this.routineRepo.findOneBy({ id: routine_id });
      if (!routine) throw new Error("No Routine found");

      await this.routineRepo.delete({id: routine.id});

      return "Routine delete successfully"
    }
}

export default  new RoutineService()