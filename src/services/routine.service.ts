import { University } from "../entities/university/university.entity";
import { AppDataSource } from "../config/database.config";
import { Module } from "../entities/module/module.entity";
import { RoutineInterface } from "../interface/routine.interface";
import { Routine } from "../entities/Routine/routine.entity";
import { Program } from "../entities/Programs/program.entity";

class RoutineService {
    constructor (
        private readonly routineRepo = AppDataSource.getRepository(Routine),
        private readonly programRepo = AppDataSource.getRepository(Program),
        private readonly moduleRepo = AppDataSource.getRepository(Module),
        private readonly uniRepo = AppDataSource.getRepository(University)
    ) {

    }
    async createRoutine ( uni_id: string, data: any){
    console.log("🚀 ~ RoutineService ~ createRoutine ~ data:", data)

      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");
        const routine =  this.routineRepo.create({
            startTime: data.startTime,
            endTime: data.endTime,
            day: data.day,
            university: uni,
            section:{
                id:data.section_id
            },
            module:{id:data.module_id}
            
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

        const getRoutine =  await this.routineRepo.find({
            where: { section: { id: section_id }, university: {id:uni.id}},
            // relations: ["module", "teacher", "section", "program"]
            relations: [ "section"]

        });
        const getRoutines = await this.routineRepo.createQueryBuilder("routine")
        .leftJoinAndSelect("routine.section","section")
        .leftJoinAndSelect("section.teacher_Section","teacherSection")
        .leftJoinAndSelect("teacherSection.teacher","teacher")
        .leftJoinAndSelect("section.moduleSection","moduleSection")
        .where("section.id =:section_id",{section_id})
        .getMany()
        console.log("🚀 ~ RoutineService ~ getRoutine ~ getRoutines:", getRoutines)
        // console.log("🚀 ~ RoutineService ~ getRoutine ~ getRoutine:", getRoutine)
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