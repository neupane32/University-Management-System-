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


router.post('/add-resource', catchAsync(teacherController.addResource));
router.patch('/update-resource', catchAsync(teacherController.updateResource));


export default router;