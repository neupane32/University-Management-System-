import { authentication } from "../middleware/authentication.middleware";
import { StudentController } from "../controllers/student.controller";
import { Router } from "express";
import { authorization } from "../middleware/authorization.middleware";
import { Role } from "../constant/enum";
import { catchAsync } from "../utils/catchAsync.utils";

const router: Router = Router();
const studentController = new StudentController;
router.use(authentication())
router.use(authorization([Role.STUDNET]));

router.post('/student-login', catchAsync(studentController.loginStudent));
router.get('/get-announcements/:module_id', catchAsync(studentController.getAnnouncements));

router.get('/get-assignments/:module_id', catchAsync(studentController.getAssignments));


