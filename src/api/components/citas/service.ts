import { Appoinment, AppoinmentReq, AppoinmentResDB } from "./model"
import { AppoinmentRepository } from "./repository"
import { DoctorRepository } from "../doctores/repository"
import { GetAllError, DeleteError, UpdateError, CreationError, RecordNotFoundError } from "../../../utils/Errors"
import { Doctor } from "../doctores/model"
import logger from "../../../utils/logger"


export interface AppoinmentService{
    createAppoinment(appoinmentReq: AppoinmentReq): Promise<Appoinment> 
    getAllAppoinment(): Promise<Appoinment[]>
    getAppoinmentById(id:number): Promise<Appoinment>
    updateAppoinment(id:number,updates:Partial<AppoinmentReq>): Promise<Appoinment>
    deleteAppoinment(id:number): Promise<void>
}

export class AppoinmentServiceImpl implements AppoinmentService{
    private appoinmentRepository: AppoinmentRepository 
    private DoctorRepository: DoctorRepository

    constructor(appointmentRepository: AppoinmentRepository, doctorRepository: DoctorRepository){
        this.appoinmentRepository = new AppoinmentRepository 
        this.DoctorRepository = new DoctorRepository
    }

    public async createAppoinment(appoinmentReq: AppoinmentReq): Promise<Appoinment>  {
        try {
            const doctor = await this.DoctorRepository.getDoctorById(appoinmentReq.id_doctor)
            if (!doctor){
                throw new RecordNotFoundError()
            } 
            const appointmentDb = await this.appoinmentRepository.createAppoinment(appoinmentReq)
            const appointment: Appoinment = mapAppointment(appointmentDb, doctor)
            return appointment
        } catch (error){
            if (error instanceof RecordNotFoundError){
                logger.error(error)
                throw new RecordNotFoundError
            } else{
                throw new CreationError('Citas')
            }
        }
        
    }
    public async getAllAppoinment(): Promise<Appoinment[]> {
        // const appoinments: Promise<Appoinment[]> = await this.appoinmentRepository.getAllAppoinments()
        // return appoinments
        return await this.appoinmentRepository.getAllAppoinments()
    }
    public async getAppoinmentById(id:number): Promise<Appoinment>{
        try{
            const appoinment = await this.appoinmentRepository.getAppoinmentById(id)
            return appoinment
        }catch (error){
            throw new RecordNotFoundError()
        }
    }
    public async updateAppoinment(id:number,updates:Partial<AppoinmentReq>): Promise<Appoinment>{
        try{
            const appoinment = await this.appoinmentRepository.getAppoinmentById(id)
            if (!appoinment){
                throw new RecordNotFoundError()
            }
            const updateAppoinment = {...appoinment, ...updates}
            await this.appoinmentRepository.updateAppoinment(id,updateAppoinment)
            return updateAppoinment
        }catch(error){
            throw  new UpdateError('Citas')
        }
    }
    public async deleteAppoinment(id:number): Promise<void>{
        try{
            const appoinment = await this.appoinmentRepository.getAppoinmentById(id)
            if (!appoinment){
                throw new RecordNotFoundError()
            }
            await this.appoinmentRepository.deleteAppoinment(id)
        }catch(error){
            throw new DeleteError('Citas')
        }
    }
}


function mapAppointment(appointmentDb: AppoinmentResDB, doctor: Doctor): Appoinment {
    const appointment: Appoinment = {
        identificacion_paciente: appointmentDb.identificacion_paciente, 
        especialidad:appointmentDb.especialidad,
        doctor: `${doctor.nombre} ${doctor.apellido}`,
        consultorio: doctor.consultorio,
        horario: appointmentDb.horario
    }
    return appointment
}