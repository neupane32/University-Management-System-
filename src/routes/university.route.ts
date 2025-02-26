import { catchAsync } from '../utils/catchAsync.utils';
import { UniversityController } from '../controllers/university.controller';
import express from 'express';
import { authentication } from '../middleware/authentication.middleware';

const router = express.Router();
const universityController = new UniversityController();

// University Auth Routes
router.post('/uni-signup', catchAsync(universityController.createUniversity));
router.post('/uni-login', catchAsync(universityController.loginUniversity));
router.get('/uni/uni-profile', catchAsync(universityController.uniProfile));
router.use(authentication());
// Program Routes
router.post('/uni/programs', catchAsync(universityController.addProgram));
router.get('/uni/find-programs', catchAsync(universityController.findProgram));
router.patch('/uni/update-program/:id', catchAsync(universityController.updateProgram));
router.delete('/uni/delete-program/:id', catchAsync(universityController.deleteProgram));

// Module Routes
router.post('/uni/add-modules/:id', catchAsync(universityController.addModule));
router.patch('/uni/update-modules/:id', catchAsync(universityController.updateModule));
router.get('/uni/find-modules', catchAsync(universityController.findModule)); 
router.delete('/uni/delete-modules/:id', catchAsync(universityController.deleteModule));

// Teacher Routes
router.post('/uni/add-teachers/:id', catchAsync(universityController.addTeacher));
router.patch('/uni/edit-teacher/:id', catchAsync(universityController.updateTeacher));
router.get('/uni/find-teachers', catchAsync(universityController.getTeacher));
router.get('/uni/teachers/:id', catchAsync(universityController.getTeacherById));
router.delete('/uni/delete-teacher/:id', catchAsync(universityController.deleteTeacher));

// Student Routes
router.post('/uni/add-students', catchAsync(universityController.addStudent));
router.get('/uni/find-students', catchAsync(universityController.getStudent));
router.patch('/uni/students/:id', catchAsync(universityController.editStudent));
router.delete('/uni/students/:id', catchAsync(universityController.deleteStudent));

// Routine Approval Route
router.patch('/uni/approve-routine/:uni_id/:routine_id', catchAsync(universityController.approveRoutine));
router.get('/uni/routines', catchAsync(universityController.getRoutinesForAdmin));


export default router;