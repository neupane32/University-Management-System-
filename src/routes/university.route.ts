import { catchAsync } from '../utils/catchAsync.utils';
import { UniversityController } from '../controllers/university.controller'
import express from 'express'
const router = express()

const universityController = new UniversityController();

router.post('/uni-signup', catchAsync(universityController.createUniversity));
router.post('/uni-login', catchAsync(universityController.loginUniversity));
router.post('/uni-addProgram', catchAsync(universityController.addProgram));
router.post('/uni-findProgram', catchAsync(universityController.findProgram));





export default router