import { catchAsync } from '../utils/catchAsync.utils';
import { UniversityController } from '../controllers/university.controller';
import express from 'express';
import { authentication } from '../middleware/authentication.middleware';
import {studentProfileImagesUpload, teacherAssignmentFileUpload, teacherProfileImagesUpload, universityProfileImagesUpload} from '../middleware/multer.middleware'
import { authorization } from '../middleware/authorization.middleware';
import {subscriptionAuthorization} from '../middleware/subscriptionAuthorization.middleware'
import { Role } from '../constant/enum';
import { SubscriptionController } from '../controllers/subscription.controller';
const router = express.Router();
const universityController = new UniversityController();
const subscriptionController = new SubscriptionController

// University Auth Routes
router.post('/uni-signup',universityProfileImagesUpload.fields([{name:'university_profile_image'}]), catchAsync(universityController.createUniversity));
router.post('/uni-login', catchAsync(universityController.loginUniversity));
router.use(authentication());
router.patch('/update-profile/', universityProfileImagesUpload.fields([{name:'university_profile_image'}]), catchAsync(universityController.updateProfile));


router.use(authorization([Role.UNIVERSITY]))

router.post('/success', catchAsync(subscriptionController.addUniSubscription));


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

// Module Routes
router.post('/uni/add-modules/:id', catchAsync(universityController.addModule));
router.patch('/uni/update-modules/:id', catchAsync(universityController.updateModule));
router.get('/uni/find-modules', catchAsync(universityController.findModule)); 
router.get('/uni/find-modules-by-id/:id', catchAsync(universityController.findModuleByProgram)); 
router.get('/uni/find-modules-by-section/:id', catchAsync(universityController.findModuleBySection)); 
router.get('/uni/find-modules-by-duration/:id/:duration', catchAsync(universityController.findModuleByDuration)); 
router.delete('/uni/delete-modules/:id', catchAsync(universityController.deleteModule));

// Teacher Routes
router.post('/uni/add-teachers',teacherProfileImagesUpload.fields([{name: 'teacher_profile_image'}]), catchAsync(universityController.addTeacher));
router.patch('/uni/edit-teacher/:id',teacherProfileImagesUpload.fields([{name: 'teacher_profile_image'}]), catchAsync(universityController.updateTeacher));
router.get('/uni/find-teachers', catchAsync(universityController.getTeacher));
router.get('/uni/find-teachers-by-id/:id', catchAsync(universityController.getTeacherByModule));
router.get('/uni/teachers/:id', catchAsync(universityController.getTeacherById));
router.delete('/uni/delete-teacher/:id', catchAsync(universityController.deleteTeacher));

// Student Routes
router.post('/add-students', studentProfileImagesUpload.fields([{name: 'student_profile_image'}]), catchAsync(universityController.addStudent) );;
router.get('/find-students', catchAsync(universityController.getStudent));
router.patch('/edit-student/:id', studentProfileImagesUpload.fields([{name: 'student_profile_image'}]), catchAsync(universityController.editStudent)); 
router.delete('/delete-student/:id', catchAsync(universityController.deleteStudent));

// assign teacher to a section
router.post('/uni/add-teacher-to-section', catchAsync(universityController.addTeacherBySection));

//getTotalStudent and teacher
router.get('/get-total-teacher', catchAsync(universityController.getTotalTeacher));
router.get('/get-total-student', catchAsync(universityController.getTotalStudent));
router.get('/get-total-program', catchAsync(universityController.getTotalProgram));

router.get('/teacher_student-ratio-by-program', catchAsync(universityController.getTeacherStudentRatioByProgram));
router.get('/get-teacher-class', catchAsync(universityController.getTeacherClassesBySectionForCurrentDate));
router.get('/get-today-announcement', catchAsync(universityController.getTodayAnnouncement));

router.post('/Khalti-subscription', catchAsync(subscriptionController.initiatePayment));
router.get('/subscription-time-left', catchAsync(subscriptionController.getSubscriptiontime));
router.get('/subscription-details-by-university', catchAsync(universityController.getSubscriptionByUni));


export default router;