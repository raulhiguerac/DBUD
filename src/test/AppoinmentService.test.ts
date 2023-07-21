import { Request, Response } from "express"
import { AppoinmentService, AppoinmentServiceImpl } from "../api/components/citas/service"
import { AppoinmentRepository } from "../api/components/citas/repository"
import { Appoinment, AppoinmentReq } from "../api/components/citas/model"
import { DoctorRepository } from "../api/components/doctores/repository"
import { Doctor } from "../api/components/doctores/model"

const mockReq = {} as Request
const mockRes = {} as Response

describe('AppoinmentController', () =>{
    let appoinmentRepository : AppoinmentRepository
    let doctorRepository: DoctorRepository
    let appoinmentService: AppoinmentService

    beforeEach( () => {
        appoinmentRepository = {
            createAppoinment: jest.fn(),
            getAllAppoinments: jest.fn(),
            getAppoinmentById: jest.fn(),
            updateAppoinment: jest.fn(),
            deleteAppoinment: jest.fn()
        }

        doctorRepository = {
            getAllDoctors: jest.fn(),
            createDoctor: jest.fn(),
            getDoctorById: jest.fn(),
            updateDoctor: jest.fn(),
            deleteDoctor: jest.fn()
        }
        
        appoinmentService = new AppoinmentServiceImpl(appoinmentRepository,doctorRepository)
    })

    describe('getAllAppoinments', () =>{
        it('It should get all appoinments from service', async () =>{
            const appoinments: Appoinment[] = [
                {
                    identificacion_paciente: "123456789",
                    especialidad: "Medicina general",
                    doctor: "1",
                    consultorio: 101,
                    horario: "7:30"
                },
                {
                    identificacion_paciente: "123456789",
                    especialidad: "Medicina general",
                    doctor: "1",
                    consultorio: 101,
                    horario: "7:30"
                }
            ];

            (appoinmentRepository.getAllAppoinments as jest.Mock).mockResolvedValue(appoinments);

            const result = await appoinmentService.getAllAppoinment()

            expect(appoinmentRepository.getAllAppoinments).toHaveBeenCalled()
            expect(result).toEqual(appoinments)
        })

        it('It should return an empty array', async () =>{
            const doctors: Appoinment[] = [];

            (appoinmentRepository.getAllAppoinments as jest.Mock).mockResolvedValue(doctors)

            const result = await appoinmentService.getAllAppoinment()

            expect(appoinmentRepository.getAllAppoinments).toHaveBeenCalled()
            expect(result).toEqual([])
        })
    })

    describe('createDoctor', () =>{
        it('It should create a doctor from service', async () =>{
            const appoinmetRes: Appoinment = 
            {
                identificacion_paciente: "123456789",
                especialidad: "Medicina general",
                doctor: "1",
                consultorio: 101,
                horario: "7:30"
            }
            const appoinmentReq: AppoinmentReq = 
            {
                identificacion_paciente: "123456789",
                especialidad: "Medicina general",
                id_doctor: 1,
                horario: "7:30"
            };

            const doctorRes: Doctor = {id_doctor: 1, nombre: 'Juanito', apellido: 'Test', especialidad: 'Medicina General', consultorio: 101};

            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(doctorRes);
            (appoinmentRepository.createAppoinment as jest.Mock).mockResolvedValue(appoinmetRes)

            const result = await appoinmentService.createAppoinment(appoinmentReq)

            expect(appoinmentRepository.createAppoinment).toHaveBeenCalledWith(appoinmentReq)
            expect(result).toEqual(appoinmetRes)
        })

        it('It should return an error 400 from service', async () =>{
            const appoinmentReq: AppoinmentReq = {
                identificacion_paciente: "123456789",
                especialidad: "Medicina general",
                id_doctor: 1,
                horario: "7:30"
            }
            const error = new Error('Record has not found yet');
            (appoinmentRepository.createAppoinment as jest.Mock).mockRejectedValue(error)


            await expect(appoinmentService.createAppoinment(appoinmentReq)).rejects.toThrowError(error)
            expect(appoinmentRepository.createAppoinment).toHaveBeenCalledWith(appoinmentReq)
        })
    })

    describe('getAppoinmentById', () =>{
        it('It should get appoinment by id', async () =>{
            const doctorId = 1;
            const appoinmetRes: Doctor = {id_doctor: 1, nombre: 'Pepito', apellido: 'Perez', especialidad: 'Pediatria', consultorio: 101};

            (appoinmentRepository.getAppoinmentById as jest.Mock).mockResolvedValue(appoinmetRes)

            const result = await appoinmentService.getAppoinmentById(doctorId)

            expect(appoinmentRepository.getAppoinmentById).toHaveBeenCalledWith(doctorId)
            expect(result).toEqual(appoinmetRes)
        })

        it('should return an empty array when no doctors are found', async () => {
            const doctorId = 1;
            (appoinmentRepository.getAppoinmentById as jest.Mock).mockResolvedValue(null)

            const result  = await appoinmentService.getAppoinmentById(doctorId)

            expect(appoinmentRepository.getAppoinmentById).toHaveBeenCalledWith(doctorId)
            expect(result).toBeNull()
        })

        it('should throw an error if retrieval fails', async () => {
            const doctorId = 1
            const error = new Error('Database error');
            (appoinmentRepository.getAppoinmentById as jest.Mock).mockRejectedValue(error)

            await expect(appoinmentService.getAppoinmentById(doctorId)).rejects.toThrowError(error)
            expect(appoinmentRepository.getAppoinmentById).toHaveBeenCalledWith(doctorId)
        })
    })

    describe('updateAppoinment', () =>{
        it('It should update the appoinment', async () =>{
            const appoinmentrId = 1;
            const appoinmentReq: AppoinmentReq = 
            {
                identificacion_paciente: "123456789",
                especialidad: "Medicina general",
                id_doctor: 1,
                horario: "7:30"
            };
            const doctorRes: Doctor = {id_doctor: 1, nombre: 'Juanito', apellido: 'Test', especialidad: 'Medicina General', consultorio: 101};

            const appoinmetRes: Appoinment = 
            {
                identificacion_paciente: "123456789",
                especialidad: "Medicina general",
                doctor: "1",
                consultorio: 101,
                horario: "7:30"
            };
            
            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(doctorRes);
            (appoinmentRepository.updateAppoinment as jest.Mock).mockResolvedValue(appoinmetRes);

            const result = await appoinmentService.updateAppoinment(appoinmentrId,appoinmentReq);

            expect(appoinmentRepository.updateAppoinment).toHaveBeenCalledWith(appoinmentrId,appoinmentReq)
            expect(result).toEqual(appoinmetRes)
        })

        it('should return an error when no doctor is found', async () => {
            const appoinmentrId = 1;
            const appoinmentReq: AppoinmentReq = 
            {
                identificacion_paciente: "123456789",
                especialidad: "Medicina general",
                id_doctor: 1,
                horario: "7:30"
            };
            const error = new Error('Failed to update Cita');
            (appoinmentRepository.updateAppoinment as jest.Mock).mockRejectedValue(error);

            await expect(appoinmentService.updateAppoinment(appoinmentrId,appoinmentReq)).rejects.toThrowError(error)
        })
    })
})