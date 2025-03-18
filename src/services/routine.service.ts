import { University } from "../entities/university/university.entity";
import { AppDataSource } from "../config/database.config";
import { Module } from "../entities/module/module.entity";
import { RoutineInterface } from "../interface/routine.interface";
import { Routine } from "../entities/Routine/routine.entity";

class RoutineService {
    constructor (
        private readonly routineRepo = AppDataSource.getRepository(Routine),
        private readonly moduleRepo = AppDataSource.getRepository(Module),
        private readonly uniRepo = AppDataSource.getRepository(University)
    ) {

    }

    async createRoutine ( uni_id: string, data: any){

      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

        const routine = await this.routineRepo.create({
            startTime: data.startTime,
            endTime: data.endTime,
            day: data.day,
            university: uni,
            section: data.section_id,
            module: data.module_id,
            teacher:data.teacher_id
        })

        await this.routineRepo.save(routine);
        return routine;
    }

    async getRoutine(uni_id: string, section_id: string){

        const uni = await this.uniRepo.findOneBy({ id: uni_id });
        if (!uni) throw new Error("University Not found");

        const getRoutine =  await this.routineRepo.find({
            where: { section: { id: section_id }, university: {id:uni.id} },
            relations: ["module", "teacher", "section"]
        });
        return getRoutine;

    }
}

export default  new RoutineService()