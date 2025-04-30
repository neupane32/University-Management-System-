import { catchAsync } from "../utils/catchAsync.utils";
import { Router } from "express";
import { authentication } from "../middleware/authentication.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { Role } from "../constant/enum";
import { RoutineController } from "../controllers/routine.controller";

const router: Router = Router();
const routineController = new RoutineController;

router.use(authentication());
router.use(authorization([Role.UNIVERSITY]))


 router.post('/create-routine/', catchAsync(routineController.createRoutine));
 router.get('/get-routine/:id', catchAsync(routineController.getRoutine));
 router.patch('/update-routine/:id', catchAsync(routineController.updateRoutine));
 router.delete('/delete-routine/:id', catchAsync(routineController.deleteRoutine));

 
export default router;
