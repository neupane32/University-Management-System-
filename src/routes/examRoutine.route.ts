import { catchAsync } from "../utils/catchAsync.utils";
import { Router } from "express";
import { authentication } from "../middleware/authentication.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { Role } from "../constant/enum";
import { ExamRoutineController } from "../controllers/examRoutine.controller";


const router: Router = Router();
const examRoutineController = new ExamRoutineController;

router.use(authentication());
router.use(authorization([Role.UNIVERSITY]))

 router.post('/create-examRoutine', catchAsync(examRoutineController.createExamRoutine));
 router.get('/examRoutine', catchAsync(examRoutineController.getExamRoutine));
 router.patch('/update-examRoutine/:id', catchAsync(examRoutineController.updateExamRoutine));
 router.delete('/delete-examRoutine/:id', catchAsync(examRoutineController.deleteExamRoutine));


 
export default router;
