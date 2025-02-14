import { authentication } from "../middleware/authentication.middleware";
import { TeacherController } from "../controllers/teacher.controller";
import { Router } from "express";
import { authorization } from "../middleware/authorization.middleware";
import { Role } from "../constant/enum";
import { catchAsync } from "../utils/catchAsync.utils";

const router: Router = Router();
const teacherController = new TeacherController;
router.use(authentication());
router.use(authorization([Role.TEACHER]));

router.post('/teacher-login', catchAsync(teacherController.loginTeacher));


router.post('/add-resource', catchAsync(teacherController.addResource));
router.patch('/update-resource', catchAsync(teacherController.updateResource));
router.delete('/delete-resource', catchAsync(teacherController.deleteResource));

router.post('/create-announce', catchAsync(teacherController.createAnnouncement));
router.patch('/update-announce', catchAsync(teacherController.updateAnnouncement));
router.delete('/delete-announce', catchAsync(teacherController.deleteAnnouncement));

router.post('/create-assignment', catchAsync(teacherController.createAssignment));


router.post('/create-routine', catchAsync(teacherController.createRoutine));







export default router;