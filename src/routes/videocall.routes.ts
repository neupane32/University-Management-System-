import { authentication } from "../middleware/authentication.middleware";
import { Router } from "express";
import { authorization } from "../middleware/authorization.middleware";
import { Role } from "../constant/enum";
import { catchAsync } from "../utils/catchAsync.utils";
import { VideocallController } from "../controllers/videocall.controller";

const router: Router = Router();
const videocallController = new VideocallController();


router.use(authentication());
router.use(authorization([Role.TEACHER]));

router.post('/create-room', catchAsync(videocallController.createRoom));
router.get('/get-room', catchAsync(videocallController.getRoom));
router.delete('/delete-room/:id', catchAsync(videocallController.deleteRoom));




export default router;