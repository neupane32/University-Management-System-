import { authentication } from "../middleware/authentication.middleware";
import { Router } from "express";
import { authorization } from "../middleware/authorization.middleware";
import { Role } from "../constant/enum";
import { catchAsync } from "../utils/catchAsync.utils";
import { AssignmentController } from "../controllers/assignment.controller";
import { teacherAssignmentFileUpload } from "../middleware/multer.middleware";

const router: Router = Router();
const assignmentController = new AssignmentController;

router.use(authentication());
router.use(authorization([Role.TEACHER]));

//resource operation
router.post('/add-assignment', teacherAssignmentFileUpload.fields([{name:'teacher_assignment_file'}]), catchAsync(assignmentController.addAssignment));
router.get('/get-assignment-by-teacher', catchAsync(assignmentController.getAssignment));
router.patch('/update-assignment/:id', teacherAssignmentFileUpload.fields([{name:'teacher_assignment_file'}]), catchAsync(assignmentController.updateAssignment));
router.delete('/delete-assignment-file/:id/:fileId', catchAsync(assignmentController.deleteAssignmentFile));
router.delete('/delete-assignment/:id', catchAsync(assignmentController.deleteAssignment));

export default router;