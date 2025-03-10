import { RoutineStatus, RoutineType } from "../constant/enum";

export interface RoutineInterface {
    title: string;
    description: string;
    start_Date: Date;
    end_date: Date;
    type: RoutineType;
    status: RoutineStatus;

}