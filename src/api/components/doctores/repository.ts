import db from "../../../config/database"
import { CreationError, GetAllError, UpdateError, RecordNotFoundError, DeleteError } from "../../../utils/Errors"
import logger from "../../../utils/logger"
import { Doctor, DoctorReq } from "./model"

export class DoctorRepository {
    public async createDoctor(doctor: DoctorReq): Promise<Doctor>{
        try {
            const [createdDoctor] =  await db('doctores').insert(doctor).returning('*') // select * from doctores where id_doctor=?
            return createdDoctor
        } catch (error) {
            throw new CreationError('Doctor')
        }
    }

    public getAllDoctors(): Promise<Doctor[]>{
        try{
            return db.select('*').from('doctores')
        } catch (error) {
            throw new GetAllError('Doctor')
        }
    }

    public async getDoctorById(id: number): Promise<Doctor>{
        try{
            const doctor = db('doctores').where({ id_doctor: id }).first()
            return doctor
        } catch (error) {
            throw new RecordNotFoundError()
        }
    }

    public async updateDoctor(id:number, updates: Partial<DoctorReq>) : Promise<void>{
        try{
           await db('doctores').where({ id_doctor: id }).update(updates)
        } catch (error){
            throw new UpdateError('Doctor')
        }
    }

    public async deleteDoctor(id: number): Promise<void> {
        try{
            await db('doctores').where({ id_doctor: id }).del()
        } catch (error){
            logger.error( 'Failed deleting doctor in repository', {error})
            throw new DeleteError('Doctor')
        }
    }
}

export default {
    DoctorRepository
}