import { Appoinment } from "./model"
import { Request,Response } from "express"
import { AppoinmentService } from "./service"



export interface AppoinmentController{
    createAppoinment(req: Request, res: Response): void
    getAllAppoinment(req: Request, res: Response): void
}

export class AppoinmentControllerImpl implements AppoinmentController{
    private appoinmentService: AppoinmentService

    constructor (appoinmentService: AppoinmentService){
        this.appoinmentService= appoinmentService
    }    
    public createAppoinment(req: Request, res: Response):void{
        const appoinment : Appoinment | null = this.appoinmentService.createAppoinment()
        res.json(appoinment)
    }
    public getAllAppoinment(req: Request, res: Response): void {
        const appoinments : Appoinment[] = this.appoinmentService.getAllAppoinment()
        res.json(appoinments)
    }
}