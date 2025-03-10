import { catchAsync } from "../utils/catchAsync.utils";
import { AdminController } from "../controllers/admin.controller";
import { Router } from "express";
import { authentication } from "../middleware/authentication.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { Role } from "../constant/enum";
import { SectionController } from "../controllers/section.controller";

const router: Router = Router();
const sectionController = new SectionController;

// router.post('/create-routine', catchAsync(sectionController.createRoutine));
// router.get('/get-routine', catchAsync(teacherController.getTeacherRoutines));


// router.get('/view-uni', catchAsync(adminController.getUniversity));
// router.delete('/delete-uni/:id', catchAsync(adminController.deleteUniversity));


// export default router;
