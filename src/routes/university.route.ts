import { catchAsync } from '../utils/catchAsync.utils';
import { UniversityController } from '../controllers/university.controller';
import express from 'express';

const router = express.Router();
const universityController = new UniversityController();

// University Auth Routes
router.post('/uni-signup', catchAsync(universityController.createUniversity));
router.post('/uni-login', catchAsync(universityController.loginUniversity));

// Program Routes
router.post('/uni/programs', catchAsync(universityController.addProgram));
router.get('/uni/programs', catchAsync(universityController.findProgram));

// Module Routes
router.post('/uni/programs/:id/modules', catchAsync(universityController.addModule));
router.patch('/uni/programs/:id/modules/:module_id', catchAsync(universityController.updateModule));
router.get('/uni/modules', catchAsync(universityController.findModule)); 
router.delete('/uni/modules/:id', catchAsync(universityController.deleteModule));

// Teacher Routes
router.post('/uni/teachers', catchAsync(universityController.addTeacher));
router.patch('/uni/teachers/:id', catchAsync(universityController.updateTeacher));
router.get('/uni/teachers', catchAsync(universityController.getTeacher));
router.get('/uni/teachers/:id', catchAsync(universityController.getTeacherById));
router.delete('/uni/teachers/:id', catchAsync(universityController.deleteTeacher));

// Student Routes
router.post('/uni/students', catchAsync(universityController.addStudent));
router.patch('/uni/students/:id', catchAsync(universityController.editStudent));
router.get('/uni/students', catchAsync(universityController.getStudent));
router.delete('/uni/students/:id', catchAsync(universityController.deleteStudent));

// Routine Approval Route
router.patch('/uni/approve-routine/:uni_id/:routine_id', catchAsync(universityController.approveRoutine));
router.get('/uni/routines', catchAsync(universityController.getRoutinesForAdmin));


export default router;