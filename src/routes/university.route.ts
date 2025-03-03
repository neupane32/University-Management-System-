import { catchAsync } from '../utils/catchAsync.utils';
import { UniversityController } from '../controllers/university.controller';
import express from 'express';
import { authentication } from '../middleware/authentication.middleware';

const router = express.Router();
const universityController = new UniversityController();

// University Auth Routes
router.post('/uni-signup', catchAsync(universityController.createUniversity));
router.post('/uni-login', catchAsync(universityController.loginUniversity));

router.use(authentication());

//uni profile
router.get('/profile', catchAsync(universityController.uniProfile));
router.get('/noSection', catchAsync(universityController.getStudentsWithoutSection));

router.patch('/update-profile/:id', catchAsync(universityController.updateProfile));



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
// router.patch('/uni/update-modules/:id', catchAsync(universityController.updateModule));
router.get('/uni/find-modules', catchAsync(universityController.findModule)); 
router.delete('/uni/delete-modules/:id', catchAsync(universityController.deleteModule));

// Teacher Routes
router.post('/uni/add-teachers/:id', catchAsync(universityController.addTeacher));
router.patch('/uni/edit-teacher/:id', catchAsync(universityController.updateTeacher));
router.get('/uni/find-teachers', catchAsync(universityController.getTeacher));
router.get('/uni/teachers/:id', catchAsync(universityController.getTeacherById));
router.delete('/uni/delete-teacher/:id', catchAsync(universityController.deleteTeacher));

// Student Routes
router.post('/uni/add-students/:id', catchAsync(universityController.addStudent));
router.get('/uni/find-students', catchAsync(universityController.getStudent));
// router.patch('/uni/edit-student/:id', catchAsync(universityController.editStudent));
router.delete('/uni/delete-student/:id', catchAsync(universityController.deleteStudent));

// Routine Approval Route
router.patch('/uni/approve-routine/:uni_id/:routine_id', catchAsync(universityController.approveRoutine));
router.get('/uni/routines', catchAsync(universityController.getRoutinesForAdmin));


export default router;