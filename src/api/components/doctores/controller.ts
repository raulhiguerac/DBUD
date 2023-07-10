import { Doctor } from "./model"
import { Request,Response } from "express"
import { DoctorService } from "./service"
import logger from "../../../utils/logger"


export interface DoctorController{
    getAllDoctors(req: Request, res: Response): void
    createDoctor(req: Request, res: Response): void
}

export class DoctorControllerImpl implements DoctorController{
    private doctorService: DoctorService

    constructor (doctorService: DoctorService){
        this.doctorService= doctorService
    }    
    public getAllDoctors(req: Request, res: Response):void{
        const doctors : Doctor[] = this.doctorService.getAllDoctors()
        res.json(doctors)
    }
    public createDoctor(req: Request, res: Response): void {
        const doctorReq = req.body
        try{
            this.doctorService.createDoctor(doctorReq).then((doctor) =>{
                res.json(doctor)
            })
        }
        catch (error) {
            logger.error(error)
            res.status(400).json({message:error})
        }
    }
}