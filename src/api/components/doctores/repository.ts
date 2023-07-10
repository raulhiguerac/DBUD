import db from "../../../config/database"
import { Doctor, DoctorReq } from "./model"

export class DoctorRepository {
    public async createDoctor(doctor: DoctorReq): Promise<Doctor>{
        try {
            const [createdDoctor] =  await db('doctores').insert(doctor).returning('*') // select * from doctores where id_doctor=?
            return createdDoctor
        } catch (error) {
            throw new Error(`Failed to create doctor dubt: ${error}`)
        }
    }
}