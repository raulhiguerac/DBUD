import { Patient } from "./model"
import { Request,Response } from "express"
import { PatientService, PatientServiceImpl } from "./service"


export interface PatientController{
    getAllPatients(req: Request, res: Response): void
}

export class PatientControllerImpl implements PatientController{
    private patientService: PatientService

    constructor (patientService: PatientService){
        this.patientService= patientService
    }    
    public getAllPatients(req: Request, res: Response):void{
        const patiens : Patient[] = this.patientService.getAllPatients()
        res.json(patiens)
    }
}