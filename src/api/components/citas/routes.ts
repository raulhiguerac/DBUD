import express , { Router } from 'express'
import { AppoinmentServiceImpl } from './service'
import { AppoinmentController, AppoinmentControllerImpl } from './controller'
import { AppoinmentRepository } from './repository'
import { DoctorRepository } from '../doctores/repository'

const router = Router()
const appoinmentRepository = new AppoinmentRepository
const repositoryDoctor = new DoctorRepository()
const appoinmentService = new AppoinmentServiceImpl(appoinmentRepository,repositoryDoctor)
const appoinmentController: AppoinmentController = new AppoinmentControllerImpl(appoinmentService)


router.post('/create', appoinmentController.createAppoinment.bind(appoinmentController))
router.get('', appoinmentController.getAllAppoinment.bind(appoinmentController))
router.get('/:id', appoinmentController.getAppoinmentById.bind(appoinmentController))
router.put('/:id', appoinmentController.updateAppoinment.bind(appoinmentController))
router.delete('/:id', appoinmentController.deleteAppoinment.bind(appoinmentController))

export default router