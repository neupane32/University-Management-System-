import { authentication } from "../middleware/authentication.middleware";
import { Router } from "express";
import { authorization } from "../middleware/authorization.middleware";
import { Role } from "../constant/enum";
import { catchAsync } from "../utils/catchAsync.utils";
import { teacherAssignmentFileUpload } from "../middleware/multer.middleware";
import { AttendanceController } from "../controllers/attendance.controller";
import { subscriptionAuthorization } from "../middleware/subscriptionAuthorization.middleware";

const router: Router = Router();
const attendanceController = new AttendanceController;

router.use(authentication());
router.use(authorization([Role.TEACHER]));

// router.use(subscriptionAuthorization())


//Attendance Operation
router.post('/add-attendance', catchAsync(attendanceController.addAttendance));
router.get('/sections/students/:sectionId', catchAsync(attendanceController.getSectionStudents));
router.get('/sections/get-attendance/:sectionId/:date', catchAsync(attendanceController.getAttendanceByDate));
router.get('/get/:studentId', catchAsync(attendanceController.getStudentAttendance));

export default router;