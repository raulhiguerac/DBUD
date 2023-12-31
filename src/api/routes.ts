import express, { Router } from "express"
import doctorRoutes from './components/doctores/routes'
import citaRoutes from './components/citas/routes'
import pacientRoutes from './components/pacientes/routes'

const router = Router()

router.use('/doctores', doctorRoutes)
router.use('/citas', citaRoutes)
router.use('/pacientes', pacientRoutes)


export default router