import { authentication } from "../middleware/authentication.middleware";
import { TeacherController } from "../controllers/teacher.controller";
import { Router } from "express";
import { authorization } from "../middleware/authorization.middleware";
import {teacherResourceFileUpload} from "../middleware/multer.middleware"
import { Role } from "../constant/enum";
import { catchAsync } from "../utils/catchAsync.utils";

const router: Router = Router();
const teacherController = new TeacherController;

router.post('/teacher-login', catchAsync(teacherController.loginTeacher));


// router.use(authentication());
// router.use(authorization([Role.TEACHER]));

//Resource Operation by teacher
router.post('/add-resource', teacherResourceFileUpload.fields([{name:'teacher_resource_file'}]), catchAsync(teacherController.addResource));
router.get('/get-resource/:id', catchAsync(teacherController.getResource));
router.delete('/delete-resource/:id', catchAsync(teacherController.deleteResource));

//Announcement Operation by teacher
router.post('/post-announcement', catchAsync(teacherController.postAnnouncement));
router.get('/get-announcement', catchAsync(teacherController.getAnnouncement));
router.patch('/update-announce/:id', catchAsync(teacherController.updateAnnouncement));
router.delete('/delete-announce/:id', catchAsync(teacherController.deleteAnnouncement));

router.post('/create-assignment', catchAsync(teacherController.createAssignment));









export default router;