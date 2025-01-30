import { UniversityController } from '../controllers/university.controller'
import express from 'express'
const router = express()

const universityController = new UniversityController();

router.post('/uni-signup', universityController.createUniversity);



export default router