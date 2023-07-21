import { Appoinment } from "./model"
import { Request,Response } from "express"
import { AppoinmentService } from "./service"
import logger from "../../../utils/logger"
import { DeleteError,GetAllError,UpdateError,CreationError,RecordNotFoundError } from "../../../utils/Errors"


export interface AppoinmentController{
    createAppoinment(req: Request, res: Response): void
    getAllAppoinment(req: Request, res: Response): Promise<void>
    getAppoinmentById(req: Request, res: Response): Promise<void>
    updateAppoinment(req: Request, res: Response): Promise<void>
    deleteAppoinment(req: Request, res: Response): Promise<void>
}

export class AppoinmentControllerImpl implements AppoinmentController{
    private appoinmentService: AppoinmentService

    constructor (appoinmentService: AppoinmentService){
        this.appoinmentService= appoinmentService
    }   

    public createAppoinment(req: Request, res: Response):void{
        const appoinmentReq = req.body
        this.appoinmentService.createAppoinment(appoinmentReq).then(
        (appoinment) =>{
            res.status(201).json(appoinment)
        },
        (error) =>{
            if (error instanceof CreationError){
                res.status(400).json({
                   error: error.message
                })
            } else {
                res.status(400).json({
                    message: error.message
                })
            }
        })
    }
    public async getAllAppoinment(req: Request, res: Response): Promise<void> {
        try{
            const appoinments = await this.appoinmentService.getAllAppoinment()
            res.status(200).json(appoinments)
        }
        catch (error) {
            logger.error(error)
            res.status(400).json({message:error})
        }
    }
    public async getAppoinmentById(req: Request, res: Response): Promise<void> {
        try{
            const id = parseInt(req.params.id)
            const appoinment = await this.appoinmentService.getAppoinmentById(id)
            if ( appoinment ) {
                res.status(200).json(appoinment)
            } else {
                throw new RecordNotFoundError()
            }
        } catch (error) {
            // logger.error(error)
            if (error instanceof RecordNotFoundError){
                res.status(400).json({error: error.message})
            } else {
                res.status(400).json({error: 'Failed to retrieve appoinment'})
            }
        }
    }
    public async updateAppoinment(req: Request, res: Response): Promise<void> {
        try{
            const id = parseInt(req.params.id)
            const appoinmentReq = req.body
            const appoinment = await this.appoinmentService.updateAppoinment(id,appoinmentReq)
            if ( appoinment ) {
                res.status(200).json(appoinment)
            } else {
                throw new UpdateError('Citas')
            }
        } catch (error) {
            // logger.error(error)
            if (error instanceof RecordNotFoundError){
                res.status(400).json({error: error.message})
            } else if (error instanceof UpdateError){
                res.status(400).json({error: error.message})
            }
            else {
                res.status(400).json({error: 'Failed to update appoinment'})
            }
        }
    }
    public async deleteAppoinment(req: Request, res: Response): Promise<void> {
        try{
            const id = parseInt(req.params.id)
            await this.appoinmentService.deleteAppoinment(id)
            res.status(200).json({message: "Appoinment was deleted"})
        } catch (error) {
            // logger.error(error)
            if (error instanceof RecordNotFoundError){
                res.status(400).json({error: error.message})
            } else if (error instanceof DeleteError){
                res.status(400).json({error: error.message})
            }
            else {
                res.status(400).json({error: 'Failed to delete appoinment'})
            }
        }
    }
}