import { authentication } from "../middleware/authentication.middleware";
import { StudentController } from "../controllers/student.controller";
import { Router } from "express";
import { authorization } from "../middleware/authorization.middleware";
import { Role } from "../constant/enum";
import { catchAsync } from "../utils/catchAsync.utils";
import { AssignmentController } from "../controllers/assignment.controller";
import { studentAssignmentFileUpload, studentProfileImagesUpload } from "../middleware/multer.middleware";
import { ResourceController } from "../controllers/resource.controller";
import { RoutineController } from "../controllers/routine.controller";
import { VideocallController } from "../controllers/videocall.controller";

const router: Router = Router();
const studentController = new StudentController;
const assignmentController = new AssignmentController;
const resourceController = new ResourceController();
const routineController = new RoutineController();
const videocallController = new VideocallController();

router.post('/login', catchAsync(studentController.loginStudent));
router.use(authentication())
router.use(authorization([Role.STUDENT]));

router.get('/student-profile', catchAsync(studentController.studentProfile));
router.patch('/update-profile', studentProfileImagesUpload.fields([{name: 'student_profile_image'}]), catchAsync(studentController.updateProfile))

router.get('/get-announcements/:module_id', catchAsync(studentController.getAnnouncements));
router.get('/get-all-announcements', catchAsync(studentController.getAnnouncementsByStudent));
router.get('/get-assignments/:module_id', catchAsync(studentController.getAssignments));
router.post('/submit-assignments/:id',studentAssignmentFileUpload.fields([{name: 'student_assignment_file'}]) ,catchAsync(assignmentController.submitAssignment));
router.get('/get-assignmentsByStudent/:moduleId', catchAsync(assignmentController.getAssignmentByStudent));
router.patch('/update-assignment/:id', studentAssignmentFileUpload.fields([{name:'student_assignment_file'}]), catchAsync(assignmentController.updateAssignmentByStudent));
router.delete('/delete-assignment-file/:id/:fileId', catchAsync(assignmentController.deleteAssignmentFileByStudent));

router.get('/get-module-by-student/:id', catchAsync(resourceController.getResourceByStudent));
 router.get('/get-routine-by-student', catchAsync(routineController.getRoutineByStudent));

router.get('/student-profile',catchAsync(studentController.studentProfile));
router.get('/student-modules',catchAsync(studentController.getStudentModules))

router.get('/get-notification-by-student', catchAsync(studentController.getStudentNotification));
router.post('/mark-as-read',catchAsync(studentController.markAsRead))

router.get('/get-room-by-student', catchAsync(videocallController.getRoomByStudent));
router.get('/get-today-Schedule', catchAsync(studentController.getTodaySchedule));





export default router;