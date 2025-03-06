import { authentication } from "../middleware/authentication.middleware";
import { SectionController } from "../controllers/section.controller";
import { Router } from "express";
import { authorization } from "../middleware/authorization.middleware";
import { Role } from "../constant/enum";
import { catchAsync } from "../utils/catchAsync.utils";

const router: Router = Router();
const sectionController = new SectionController();

router.use(authentication())
router.use(authorization([Role.UNIVERSITY]));

router.post('/create-section', catchAsync(sectionController.addSection));
router.get('/get-section', catchAsync(sectionController.getSections));

export default router;