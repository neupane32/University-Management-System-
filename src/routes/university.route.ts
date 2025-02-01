import { catchAsync } from '../utils/catchAsync.utils';
import { UniversityController } from '../controllers/university.controller'
import express from 'express'
const router = express()

const universityController = new UniversityController();

router.post('/uni-signup', catchAsync(universityController.createUniversity));
router.post('/uni-login', catchAsync(universityController.loginUniversity));
router.post('/uni-addProgram', catchAsync(universityController.addProgram));
router.get('/uni-findProgram', catchAsync(universityController.findProgram));
router.post('/uni-addModule', catchAsync(universityController.addModule));
router.patch('/uni-updateModule', catchAsync(universityController.updateModule));
router.get('/uni-findModule', catchAsync(universityController.findModule));
router.delete('/uni-deleteModule', catchAsync(universityController.deleteModule));










export default router