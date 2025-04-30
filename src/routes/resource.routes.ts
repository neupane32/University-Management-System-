import { authentication } from "../middleware/authentication.middleware";
import { Router } from "express";
import { authorization } from "../middleware/authorization.middleware";
import {teacherResourceFileUpload} from "../middleware/multer.middleware"
import { Role } from "../constant/enum";
import { catchAsync } from "../utils/catchAsync.utils";
import { ResourceController } from "../controllers/resource.controller";

const router: Router = Router();
const resourceController = new ResourceController;

router.use(authentication());
 router.use(authorization([Role.TEACHER]));

//resource operation
router.post('/add-resource', teacherResourceFileUpload.fields([{name:'teacher_resource_file'}]), catchAsync(resourceController.addResource));
router.get('/get-resource/:id', catchAsync(resourceController.getResource));
router.delete('/delete-resource/:id', catchAsync(resourceController.deleteResource));


export default router;