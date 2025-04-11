import { authentication } from "../middleware/authentication.middleware";
import { TeacherController } from "../controllers/teacher.controller";
import { Router } from "express";
import { authorization } from "../middleware/authorization.middleware";
import { Role } from "../constant/enum";
import { catchAsync } from "../utils/catchAsync.utils";
import { RoutineController } from "../controllers/routine.controller";

const router: Router = Router();
const teacherController = new TeacherController;
const routineController = new RoutineController

router.post('/teacher-login', catchAsync(teacherController.loginTeacher));


router.use(authentication());
 router.use(authorization([Role.TEACHER]));

//teacher
router.get('/get-Teacher-by-module', catchAsync(teacherController.getTeacherByModule));
router.get('/get-sections-by-module/:moduleId', catchAsync(teacherController.getSectionsByModule));
router.get('/get-teacher-sections',catchAsync(teacherController.getTeacherSection));

router.get('/get-routine-by-teacher', catchAsync(routineController.getRoutineByTeacher));


export default router;