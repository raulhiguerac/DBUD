import express , { Router } from 'express'
import { AppoinmentServiceImpl } from './service'
import { AppoinmentController, AppoinmentControllerImpl } from './controller'

const router = Router()
const appoinmentService = new AppoinmentServiceImpl()
const appoinmentController: AppoinmentController = new AppoinmentControllerImpl(appoinmentService)


router.post('/create', appoinmentController.createAppoinment.bind(appoinmentController))
router.get('/list', appoinmentController.createAppoinment.bind(appoinmentController))
export default router