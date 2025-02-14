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
router.patch('/uni/programs/:id/modules/:module_id', catchAsync(universityController.updateModule)); // `:id` is program_id, `:module_id` is module_id
router.get('/uni/modules', catchAsync(universityController.findModule)); 
router.delete('/uni/modules/:id', catchAsync(universityController.deleteModule)); // `:id` is module_id

// Teacher Routes
router.post('/uni/teachers', catchAsync(universityController.addTeacher));
router.patch('/uni/teachers/:id', catchAsync(universityController.updateTeacher)); // `:id` is teacher_id
router.get('/uni/teachers', catchAsync(universityController.getTeacher));
router.get('/uni/teachers/:id', catchAsync(universityController.getTeacherById)); // `:id` is teacher_id
router.delete('/uni/teachers/:id', catchAsync(universityController.deleteTeacher)); // `:id` is teacher_id

// Student Routes
router.post('/uni/students', catchAsync(universityController.addStudent));
router.patch('/uni/students/:id', catchAsync(universityController.editStudent)); // `:id` is student_id
router.get('/uni/students', catchAsync(universityController.getStudent));
router.delete('/uni/students/:id', catchAsync(universityController.deleteStudent)); // `:id` is student_id

// Routine Approval Route
router.patch('/uni/approve-routine/:uni_id/:routine_id', catchAsync(universityController.approveRoutine));

export default router;