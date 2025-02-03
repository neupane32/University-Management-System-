import { catchAsync } from '../utils/catchAsync.utils';
import { UniversityController } from '../controllers/university.controller'
import express from 'express'
const router = express()

const universityController = new UniversityController();

router.post('/uni-signup', catchAsync(universityController.createUniversity));
router.post('/uni-login', catchAsync(universityController.loginUniversity));
router.post('/uni-addProgram', catchAsync(universityController.addProgram));
router.get('/uni-findProgram', catchAsync(universityController.findProgram));

//Module Operation
router.post('/uni-addModule', catchAsync(universityController.addModule));
router.patch('/uni-updateModule', catchAsync(universityController.updateModule));
router.get('/uni-findModule', catchAsync(universityController.findModule));
router.delete('/uni-deleteModule', catchAsync(universityController.deleteModule));

//teacher operation
router.post('/uni-addTeacher', catchAsync(universityController.addTeacher));
router.patch('/uni-updateTeacher', catchAsync(universityController.updateTeacher));
router.get('/uni-getTeachers', catchAsync(universityController.getTeacher));
router.get('/uni-getTeacherById', catchAsync(universityController.getTeacherById));
router.delete('/uni-deleteTeacher', catchAsync(universityController.deleteTeacher));


//resource operation
router.post('/uni-addResource', catchAsync(universityController.addResource));















export default router