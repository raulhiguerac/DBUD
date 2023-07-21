import db from "../../../config/database"
import { Patient, PatientReq } from "./model"
import { DeleteError,RecordNotFoundError, GetAllError,UpdateError,CreationError } from "../../../utils/Errors"

export class PatientRepository {
    public async createPatient(patient: PatientReq): Promise<Patient>{
        try {
            const [createdPatient] =  await db('pacientes').insert(patient).returning('*') // select * from doctores where id_doctor=?
            return createdPatient
        } catch (error) {
            throw new CreationError('Patient')
        }
    }

    public getAllPatients(): Promise<Patient[]>{
        try{
            return db.select('*').from('pacientes')
        } catch (error) {
            throw new GetAllError('Patient')
        }
    }
    public async getPatientById(id: number): Promise<Patient>{
        try{
            const patient = db('pacientes').where({  id_paciente: id }).first()
            return patient
        } catch (error) {
            throw new RecordNotFoundError()
        }
    }

    public async updatePatient(id:number, updates: Partial<PatientReq>) : Promise<void>{
        try{
           await db('pacientes').where({  id_paciente: id }).update(updates)
        } catch (error){
            throw new UpdateError('Patient')
        }
    }

    public async deletePatient(id: number): Promise<void> {
        try{
            await db('pacientes').where({  id_paciente: id }).del()
        } catch (error){
            // logger.error( 'Failed deleting doctor in repository', {error})
            throw new DeleteError('Patient')
        }
    }
}