import { catchAsync } from '../utils/catchAsync.utils';
import { UniversityController } from '../controllers/university.controller';
import express from 'express';
import { authentication } from '../middleware/authentication.middleware';
import {universityProfileImagesUpload} from '../middleware/multer.middleware'
import { authorization } from '../middleware/authorization.middleware';
import {subscriptionAuthorization} from '../middleware/subscriptionAuthorization.middleware'
import { Role } from '../constant/enum';
const router = express.Router();
const universityController = new UniversityController();

// University Auth Routes
router.post('/uni-signup',universityProfileImagesUpload.fields([{name:'university_profile_image'}]), catchAsync(universityController.createUniversity));
router.post('/uni-login', catchAsync(universityController.loginUniversity));
router.patch('/update-profile/:id', universityProfileImagesUpload.fields([{name:'university_profile_image'}]), catchAsync(universityController.updateProfile));

router.use(authentication());
router.use(authorization([Role.UNIVERSITY]))

router.post('/payment-success', catchAsync(universityController.uniProfile));


//uni profile
router.get('/uni-profile', catchAsync(universityController.uniProfile));
//Announcement Routes
router.post('/uni/post-announcement', catchAsync(universityController.postAnnouncement));
router.get('/uni/get-announcement', catchAsync(universityController.getAnnouncement));
router.patch('/uni/update-announcement/:id', catchAsync(universityController.updateAnnouncement));
router.delete('/uni/delete-Announcement/:id', catchAsync(universityController.deleteAnnouncement));

// Program Routes

router.post('/uni/programs', catchAsync(universityController.addProgram));

router.get('/uni/find-programs', catchAsync(universityController.findProgram));
router.patch('/uni/update-program/:id', catchAsync(universityController.updateProgram));
router.delete('/uni/delete-program/:id', catchAsync(universityController.deleteProgram));


router.use(subscriptionAuthorization())

// Module Routes
router.post('/uni/add-modules/:id', catchAsync(universityController.addModule));
router.patch('/uni/update-modules/:id', catchAsync(universityController.updateModule));
router.get('/uni/find-modules', catchAsync(universityController.findModule)); 
router.get('/uni/find-modules-by-id/:id', catchAsync(universityController.findModuleByProgram)); 
router.get('/uni/find-modules-by-section/:id', catchAsync(universityController.findModuleBySection)); 
router.get('/uni/find-modules-by-duration/:id/:duration', catchAsync(universityController.findModuleByDuration)); 
router.delete('/uni/delete-modules/:id', catchAsync(universityController.deleteModule));

// Teacher Routes
router.post('/uni/add-teachers', catchAsync(universityController.addTeacher));
router.patch('/uni/edit-teacher/:id', catchAsync(universityController.updateTeacher));
router.get('/uni/find-teachers', catchAsync(universityController.getTeacher));
router.get('/uni/find-teachers-by-id/:id', catchAsync(universityController.getTeacherByModule));
router.get('/uni/teachers/:id', catchAsync(universityController.getTeacherById));
router.delete('/uni/delete-teacher/:id', catchAsync(universityController.deleteTeacher));

// Student Routes
router.post('/add-students', catchAsync(universityController.addStudent));
router.get('/find-students', catchAsync(universityController.getStudent));
router.patch('/edit-student/:id', catchAsync(universityController.editStudent)); 
router.delete('/delete-student/:id', catchAsync(universityController.deleteStudent));

// assign teacher to a section
router.post('/uni/add-teacher-to-section', catchAsync(universityController.addTeacherBySection));


export default router;