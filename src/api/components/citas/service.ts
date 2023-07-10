import { Appoinment } from "./model"

export interface AppoinmentService{
    createAppoinment(): Appoinment | null
    getAllAppoinment(): Appoinment[]
}

export class AppoinmentServiceImpl implements AppoinmentService{
    public createAppoinment(): Appoinment | null {
        return null
    }
    public getAllAppoinment(): Appoinment[] {
        return []
    }
}
