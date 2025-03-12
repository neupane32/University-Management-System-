import { authentication } from "../middleware/authentication.middleware";
import { StudentController } from "../controllers/student.controller";
import { Router } from "express";
import { authorization } from "../middleware/authorization.middleware";
import { Role } from "../constant/enum";
import { catchAsync } from "../utils/catchAsync.utils";

const router: Router = Router();
const studentController = new StudentController;

router.post('/login', catchAsync(studentController.loginStudent));
router.use(authentication())
router.use(authorization([Role.STUDNET]));
router.get('/get-announcements/:module_id', catchAsync(studentController.getAnnouncements));

router.get('/get-assignments/:module_id', catchAsync(studentController.getAssignments));


router.post('/submit-assignment', catchAsync(studentController.submitAssignment));
// router.get('/routines', catchAsync(studentController.getRoutine));

export default router;