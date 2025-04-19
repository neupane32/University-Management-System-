import { authentication } from "../middleware/authentication.middleware";
import { TeacherController } from "../controllers/teacher.controller";
import { Router } from "express";
import { authorization } from "../middleware/authorization.middleware";
import { Role } from "../constant/enum";
import { catchAsync } from "../utils/catchAsync.utils";
import { RoutineController } from "../controllers/routine.controller";
import { teacherProfileImagesUpload } from "../middleware/multer.middleware";


const router: Router = Router();
const teacherController = new TeacherController;
const routineController = new RoutineController;


router.post('/teacher-login', catchAsync(teacherController.loginTeacher));


router.use(authentication());



 router.use(authorization([Role.TEACHER]));

//teacher
router.get('/teacher-profile', catchAsync(teacherController.teacherProfile));
router.patch('/update-profile', teacherProfileImagesUpload.fields([{name: 'teacher_profile_image'}]), catchAsync(teacherController.updateProfile));


router.get('/get-Teacher-by-module', catchAsync(teacherController.getTeacherByModule));
router.get('/get-sections-by-module/:moduleId', catchAsync(teacherController.getSectionsByModule));
router.get('/get-teacher-sections',catchAsync(teacherController.getTeacherSection));

router.get('/get-routine-by-teacher', catchAsync(routineController.getRoutineByTeacher));
router.get('/get-notification-by-teacher', catchAsync(teacherController.getTeacherNotification));



router.get('/get-modules-by-section-of-teacher/:sectionId',catchAsync(teacherController.getModulesBySectionOfTeacher))



router.get('/get-teachers-sections',catchAsync(teacherController.getSections))

router.post('/mark-as-read',catchAsync(teacherController.markAsRead))
// router.get('/get-teacher-class', catchAsync(teacherController.getTodayClass));

//dashboard operation
router.get('/get-pending-assignment',catchAsync(teacherController.getPendingAssignment));
router.get('/get-Attendance-overview-by-section',catchAsync(teacherController.getAttendanceOverviewByTeacher));
router.get('/get-today-schedule',catchAsync(teacherController.getTodaySchedule));
router.get('/get-total-section', catchAsync(teacherController.getTotalSection));
export default router;