import { Patient } from "./model"

export interface PatientService{
    getAllPatients(): Patient[]
}

export class PatientServiceImpl implements PatientService{
    public getAllPatients(): Patient[] {
        const patients = [
            {id_paciente: 1 , nombre: 'John' , apellido : 'Doe', identificacion:"123456789", telefono: 111111},
        ]
        return patients
    }
}