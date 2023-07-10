import express , { Router } from 'express'
import { PatientServiceImpl } from './service'
import { PatientController, PatientControllerImpl } from './controller'

const router = Router()
const patientService = new PatientServiceImpl()
const patientController: PatientController = new PatientControllerImpl(patientService)

router.get('',  patientController.getAllPatients.bind(patientController))

export default router