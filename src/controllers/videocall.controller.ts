
import { Request, Response } from "express";
import { StatusCodes } from "../constant/StatusCode";
import videocallService from "../services/videocall.service";



export class VideocallController {

    async createRoom(req: Request, res: Response) {
        try {
            const teacher_id = req.user.id;

            const data = await videocallService.createRoom(teacher_id, req.body);
            res.status(StatusCodes.CREATED).json({
                status: true,
                message: "Room created successfully",
                data: data
            });

        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                status: false,
                message: "Failed to create room",
                error: error.message
            });
        }      
}

async getRoom(req: Request, res: Response) {
    try {
        const teacher_id = req.user.id;
        const data = await videocallService.getRoom(teacher_id);
        res.status(StatusCodes.SUCCESS).json({
            status: true,
            message: "Room fetched successfully",
            data
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            status: false,
            message: "Failed to fetch room",
            error: error.message
        });
    }
}

async getRoomByStudent(req: Request, res: Response) {
    try {
        const student_id = req.user.id;
        const data = await videocallService.getRoomByStudent(student_id);
        res.status(StatusCodes.SUCCESS).json({
            status: true,
            message: "Room fetched successfully",
            data
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            status: false,
            message: "Failed to fetch room",
            error: error.message
        });
    }
}

async deleteRoom(req: Request, res: Response) {
    try {
        const teacher_id = req.user.id;
        const room_id = req.params.id;
        const data = await videocallService.deleteRoom(teacher_id, room_id);
        res.status(StatusCodes.SUCCESS).json({
            status: true,
            message: "Room deleted successfully",
            data
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({
            status: false,
            message: "Failed to delete room",
            error: error.message
        });
    }

}
  
}
