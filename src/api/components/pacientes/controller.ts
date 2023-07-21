import { Request,Response } from "express"
import { PatientService, PatientServiceImpl } from "./service"
import logger from "../../../utils/logger"
import { DeleteError,GetAllError,UpdateError,CreationError,RecordNotFoundError } from "../../../utils/Errors"


export interface PatientController{
    createPatient(req: Request, res: Response): void
    getAllPatients(req: Request, res: Response): Promise<void>
    getPatientById(req: Request, res: Response): void
    updatePatient(req: Request, res: Response): void
    deletePatient(req: Request, res: Response): void
}

export class PatientControllerImpl implements PatientController{
    private patientService: PatientService

    constructor (patientService: PatientService){
        this.patientService= patientService
    }    

    public createPatient(req: Request, res: Response):void{
        const patientReq = req.body
        this.patientService.createPatient(patientReq).then(
        (patient) =>{
            res.status(201).json(patient)
        },
        (error) =>{
            if (error instanceof CreationError){
                res.status(400).json({
                   error: error.message
                })
            } else {
                res.status(400).json({
                    message: "Internal Server Error"
                })
            }
        })
    }
    public async getAllPatients(req: Request, res: Response): Promise<void>{
        try{
            const patiens = await this.patientService.getAllPatients()
            res.status(200).json(patiens)
        }
        catch (error) {
            logger.error(error)
            if (error instanceof GetAllError){
                res.status(400).json({error:error.message})
            } else{
                res.status(400).json({error:"Error getting all patients"})
            }
        }  
    }
    public async getPatientById(req: Request, res: Response): Promise<void> {
        try{
            const id = parseInt(req.params.id)
            const patient = await this.patientService.getPatientById(id)
            if ( patient ) {
                res.status(200).json(patient)
            } else {
                throw new RecordNotFoundError()
            }
        } catch (error) {
            if (error instanceof RecordNotFoundError){
                res.status(400).json({error: error.message})
            } else {
                res.status(400).json({error: 'Failed to retrieve patient'})
            }
        }
    }
    public async updatePatient(req: Request, res: Response): Promise<void> {
        try{
            const id = parseInt(req.params.id)
            const patientReq = req.body
            const patien = await this.patientService.updatePatient(id,patientReq)
            if ( patien ) {
                res.status(200).json(patien)
            } else {
                throw new UpdateError('Patient')
            }
        } catch (error) {
            logger.error(error)
            if (error instanceof RecordNotFoundError){
                res.status(400).json({error: error.message})
            } else if (error instanceof UpdateError){
                res.status(400).json({error: error.message})
            }
            else {
                res.status(400).json({error: 'Failed to update patient'})
            }
        }
    }
    public async deletePatient(req: Request, res: Response): Promise<void> {
        try{
            const id = parseInt(req.params.id)
            await this.patientService.deletePatient(id)
            res.status(200).json({message: "Patient was deleted"})
        } catch (error) {
            if (error instanceof RecordNotFoundError){
                res.status(400).json({error: error.message})
            } else if (error instanceof DeleteError){
                res.status(400).json({error: error.message})
            }
            else {
                res.status(400).json({error: 'Failed to delete patient'})
            }
        }
    }
}