import { authentication } from "../middleware/authentication.middleware";
import { TeacherController } from "../controllers/teacher.controller";
import { Router } from "express";
import { authorization } from "../middleware/authorization.middleware";
import { Role } from "../constant/enum";
import { catchAsync } from "../utils/catchAsync.utils";

const router: Router = Router();
const teacherController = new TeacherController;

router.post('/teacher-login', catchAsync(teacherController.loginTeacher));


router.use(authentication());
router.use(authorization([Role.TEACHER]));


router.post('/add-resource', catchAsync(teacherController.addResource));
router.patch('/update-resource/:id', catchAsync(teacherController.updateResource));
router.delete('/delete-resource/:id', catchAsync(teacherController.deleteResource));

router.post('/create-announcement', catchAsync(teacherController.createAnnouncement));
router.get('/get-announcement', catchAsync(teacherController.getAnnouncement));
router.patch('/update-announce/:id', catchAsync(teacherController.updateAnnouncement));
router.delete('/delete-announce/:id', catchAsync(teacherController.deleteAnnouncement));

router.post('/create-assignment', catchAsync(teacherController.createAssignment));


router.post('/create-routine', catchAsync(teacherController.createRoutine));
router.get('/get-routine', catchAsync(teacherController.getTeacherRoutines));








export default router;