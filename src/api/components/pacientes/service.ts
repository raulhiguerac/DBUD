import { Patient, PatientReq } from "./model"
import { PatientRepository } from "./repository"
import { DeleteError,GetAllError,UpdateError,CreationError,RecordNotFoundError } from "../../../utils/Errors"
import logger from "../../../utils/logger"
import { error } from "winston"

export interface PatientService{
    createPatient(patientReq: PatientReq): Promise<Patient>
    getAllPatients(): Promise<Patient[]>
    getPatientById(id: number): Promise<Patient>
    updatePatient(id: number, update: Partial<PatientReq>): Promise<Patient>
    deletePatient(id: number): Promise<void>
}

export class PatientServiceImpl implements PatientService{
    private patientRepository: PatientRepository

    constructor(patientRepository: PatientRepository){
        this.patientRepository= new PatientRepository
    }

    public createPatient(patientReq: PatientReq): Promise<Patient>{
        // const createdPatient: Promise<Patient> = this.patientRepository.createPatient(patientReq)
        // return createdPatient
        try {
            return this.patientRepository.createPatient(patientReq)
        } catch (error) {
            throw new CreationError('Patient')
        }
    }
    public getAllPatients(): Promise<Patient[]> {
        const patients : Promise<Patient[]> = this.patientRepository.getAllPatients()
        return patients
    }
    public getPatientById(id: number): Promise<Patient>{
        try{
            const patient: Promise<Patient> = this.patientRepository.getPatientById(id)
            return patient
        } catch (error) {
            throw new RecordNotFoundError()
        }
    }
    public async updatePatient(id: number, update: Partial<PatientReq>): Promise<Patient>{
        try{
            const existPatient =  await this.patientRepository.getPatientById(id)
            if (!existPatient) {
                throw new RecordNotFoundError()
            }
            const updatePatient = {...existPatient, ...update}
            this.patientRepository.updatePatient(id, updatePatient)
            return updatePatient
        } catch (error){
            if (error instanceof RecordNotFoundError){
                console.log('error de registro')
                throw new RecordNotFoundError
            } else{
                throw new UpdateError('Patient')
            }
        }
    }
    public async deletePatient(id: number): Promise<void>{
        try{
            const existPatient =  await this.patientRepository.getPatientById(id)
            if (!existPatient) {
                throw new RecordNotFoundError()
            }
            this.patientRepository.deletePatient(id)
        } catch (error){
            throw new DeleteError('Patient')
        }
    }
}