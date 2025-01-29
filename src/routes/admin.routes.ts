import { catchAsync } from "../utils/catchAsync.utils";
import { AdminController } from "../controllers/admin.controller";
import { Router } from "express";

const router: Router = Router();
const adminController = new AdminController();
router.post('/signup', catchAsync(adminController.createAdmin));

export default router;
