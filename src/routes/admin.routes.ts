import { catchAsync } from "../utils/catchAsync.utils";
import { AdminController } from "../controllers/admin.controller";
import { Router } from "express";
import { authentication } from "../middleware/authentication.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { Role } from "../constant/enum";

const router: Router = Router();
const adminController = new AdminController();
router.post('/login', catchAsync(adminController.loginAdmin));



router.use(authentication());
router.use(authorization([Role.ADMIN]));

router.get('/get-all-university', catchAsync(adminController.getAllUniversity));
router.get('/get-compare-university-subscription', catchAsync(adminController.getCompareUniversitySubscription));



export default router;
