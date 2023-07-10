import { Doctor, DoctorReq } from "./model"
import { DoctorRepository } from "./repository"

export interface DoctorService{
    getAllDoctors(): Doctor[]
    createDoctor(doctorReq: DoctorReq): Promise<Doctor>
}

export class DoctorServiceImpl implements DoctorService{
    private doctorRepository: DoctorRepository

    constructor(){
        this.doctorRepository = new DoctorRepository
    }

    public getAllDoctors(): Doctor[] {
        const doctores = [
            {id_doctor: 1 , nombre: 'John' , apellido : 'Doe', especialidad: "Medicina General", consultorio: 101},
            {id_doctor: 2 , nombre: 'Pepito' , apellido : 'Perez', especialidad: "Medicina General", consultorio: 101}
        ]
        return doctores
    }
    public createDoctor(doctorReq: DoctorReq): Promise<Doctor> {
        const createdDoctor: Promise<Doctor> = this.doctorRepository.createDoctor(doctorReq)
        return createdDoctor
    }
}
