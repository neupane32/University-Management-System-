import { authentication } from "../middleware/authentication.middleware";

import { Router } from "express";
import { authorization } from "../middleware/authorization.middleware";
import { Role } from "../constant/enum";


import { ChatController } from "../controllers/chat.controller";
import { catchAsync } from "../utils/catchAsync.utils";

const router: Router = Router();
const chatController = new ChatController();


router.use(authentication())
router.post('/add-chat', catchAsync(chatController.addChat));
router.get('/get-chat/:id',catchAsync(chatController.getChat))
router.get('/find-students/by-teacher', catchAsync(chatController.getStudent));
router.get('/find-teachers/by-teacher', catchAsync(chatController.getTeachers));

router.get('/find-students-by-student', catchAsync(chatController.getStudentByStudent));
router.get('/find-teachers-by-student', catchAsync(chatController.getTeachersByStudent));

export default router;