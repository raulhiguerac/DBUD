import { CreationError, RecordNotFoundError, UpdateError, DeleteError } from "../../../utils/Errors"
import { Doctor, DoctorReq } from "./model"
import { DoctorRepository } from "./repository"
import logger from "../../../utils/logger"

export interface DoctorService{
    getAllDoctors(): Promise<Doctor[]>
    createDoctor(doctorReq: DoctorReq): Promise<Doctor>
    getDoctorById(id: number): Promise<Doctor>
    updateDoctor(id: number, update: Partial<DoctorReq>): Promise<Doctor>
    deleteDoctor(id: number): Promise<void>
}

export class DoctorServiceImpl implements DoctorService{
    private doctorRepository: DoctorRepository

    constructor(doctorRepository: DoctorRepository){
        this.doctorRepository = doctorRepository
    }

    public getAllDoctors(): Promise<Doctor[]> {
        const doctors: Promise<Doctor[]> = this.doctorRepository.getAllDoctors()
        return doctors
    }
    public createDoctor(doctorReq: DoctorReq): Promise<Doctor> {
        try {
            // const createdDoctor: Promise<Doctor> = this.doctorRepository.createDoctor(doctorReq)
            return this.doctorRepository.createDoctor(doctorReq)
        } catch (error) {
            throw new CreationError('Doctor')
        }

    }
    public getDoctorById(id: number): Promise<Doctor> {
        try{
            const doctor: Promise<Doctor> = this.doctorRepository.getDoctorById(id)
            return doctor
        } catch (error) {
            throw new RecordNotFoundError()
        }
    }
    public  async updateDoctor(id: number, update: Partial<DoctorReq>): Promise<Doctor> {
        try{
            const existDoctor =  await this.doctorRepository.getDoctorById(id)
            if (!existDoctor) {
                throw new RecordNotFoundError()
            }
            const updateDoctor = {...existDoctor, ...update}
            this.doctorRepository.updateDoctor(id, updateDoctor)
            return updateDoctor
        } catch (error){
            logger.error(error)
            throw new UpdateError('Doctor')
        }
    }
    public  async deleteDoctor(id: number): Promise<void> {
        try{
            const existDoctor =  await this.doctorRepository.getDoctorById(id)
            if (!existDoctor) {
                throw new RecordNotFoundError()
            }
            this.doctorRepository.deleteDoctor(id)
        } catch (error){
            throw new DeleteError('Doctor')
        }
    }
}
