import express , { Router } from 'express'
import { PatientServiceImpl } from './service'
import { PatientController, PatientControllerImpl } from './controller'
import { PatientRepository } from './repository'

const router = Router()
const patientRepository = new PatientRepository
const patientService = new PatientServiceImpl(patientRepository)
const patientController: PatientController = new PatientControllerImpl(patientService)

router.get('',  patientController.getAllPatients.bind(patientController))
router.post('/create', patientController.createPatient.bind(patientController))
router.get('/:id', patientController.getPatientById.bind(patientController))
router.put('/:id', patientController.updatePatient.bind(patientController))
router.delete('/:id', patientController.deletePatient.bind(patientController))


export default router