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

//Section Operation
router.post('/create-section/:id', catchAsync(sectionController.addSection));
router.get('/get-section/:id', catchAsync(sectionController.getSections));
router.get('/get-section-by-program/:id', catchAsync(sectionController.getSectionByProgramId));
router.patch('/update-section/:id/:program_id', catchAsync(sectionController.updateSection));
router.delete('/delete-section/:id', catchAsync(sectionController.deleteSection));

//get university all section
router.get('/find-All-section', catchAsync(sectionController.getuniversitySection));



export default router;