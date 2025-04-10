import { authentication } from "../middleware/authentication.middleware";
import { StudentController } from "../controllers/student.controller";
import { Router } from "express";
import { authorization } from "../middleware/authorization.middleware";
import { Role } from "../constant/enum";
import { catchAsync } from "../utils/catchAsync.utils";
import { AssignmentController } from "../controllers/assignment.controller";
import { studentAssignmentFileUpload } from "../middleware/multer.middleware";

const router: Router = Router();
const studentController = new StudentController;
const assignmentController = new AssignmentController;

router.post('/login', catchAsync(studentController.loginStudent));
router.use(authentication())
router.use(authorization([Role.STUDENT]));
router.get('/get-announcements/:module_id', catchAsync(studentController.getAnnouncements));
router.get('/get-assignments/:module_id', catchAsync(studentController.getAssignments));
router.post('/submit-assignments/:id',studentAssignmentFileUpload.fields([{name: 'student_assignment_file'}]) ,catchAsync(assignmentController.submitAssignment));
router.get('/get-assignmentsByStudent/:moduleId', catchAsync(assignmentController.getAssignmentByStudent));
router.patch('/update-assignment/:id', studentAssignmentFileUpload.fields([{name:'student_assignment_file'}]), catchAsync(assignmentController.updateAssignmentByStudent));
router.delete('/delete-assignment-file/:id/:fileId', catchAsync(assignmentController.deleteAssignmentFileByStudent));

// router.get('/find-sutdents', catchAsync(studentController.getStudent));
router.get('/student-profile',catchAsync(studentController.studentProfile));
router.get('/student-modules',catchAsync(studentController.getStudentModules))

export default router;