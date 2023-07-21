import db from "../../../config/database"
import { Appoinment, AppoinmentReq, AppoinmentResDB } from "./model"
import { DeleteError,GetAllError,UpdateError,CreationError,RecordNotFoundError } from "../../../utils/Errors"
import logger from "../../../utils/logger"

export class AppoinmentRepository {
    public async createAppoinment(appoinment: AppoinmentReq): Promise<AppoinmentResDB>{
        try {
            const [createdAppoinment] =  await db('citas').insert(appoinment).returning('*') // select * from doctores where id_doctor=?
            return createdAppoinment
        } catch (error) {
            throw new CreationError('Appoinment')
        }
    }

    public async getAllAppoinments(): Promise<Appoinment[]>{
        try{
            return await db.select('*').from('citas')
        } catch (error) {
            throw new GetAllError('Appoinment')
        }
    }

    public async getAppoinmentById(id: number): Promise<Appoinment>{
        try{
            const appoinment = await db('citas').where({  id_cita: id }).first()
            return appoinment
        } catch (error) {
            throw new RecordNotFoundError()
        }
    }

    public async updateAppoinment(id:number,updates:Partial<AppoinmentReq>): Promise<void>{
        try{
            await db('citas').where({  id_cita: id }).update(updates)
        } catch (error){
            throw new UpdateError('Citas') 
        }
    }

    public async deleteAppoinment(id:number): Promise<void>{
        try{
            await db('citas').where({  id_cita: id }).del()
        } catch (error){
            logger.error( 'Failed deleting appoinment in repository', {error})
            throw new DeleteError('Citas')
        }
    }
}