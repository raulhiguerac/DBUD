import { Request, Response } from "express"
import { DoctorController, DoctorControllerImpl } from "../api/components/doctores/controller"
import { DoctorService, DoctorServiceImpl } from "../api/components/doctores/service"
import { Doctor, DoctorReq } from "../api/components/doctores/model"

const mockReq = {} as Request
const mockRes = {} as Response

describe('DoctorController', () =>{
    let doctorService: DoctorService
    let doctorController : DoctorController

    beforeEach( () => {
        doctorService = {
            getAllDoctors: jest.fn(),
            createDoctor: jest.fn(),
            getDoctorById: jest.fn(),
            updateDoctor: jest.fn(),
            deleteDoctor: jest.fn()
        }
        doctorController = new DoctorControllerImpl(doctorService)
        mockRes.status = jest.fn().mockReturnThis()
        mockRes.json = jest.fn().mockReturnThis()
    })

    describe('getAllDoctors', () => {
        it('It should return All doctors', async () =>{
            const doctors: Doctor[] = [
                {id_doctor: 1, nombre: 'Pepito', apellido: 'Perez', especialidad: 'Pediatria', consultorio: 101},
                {id_doctor: 2, nombre: 'Juanito', apellido: 'Perez', especialidad: 'Medicina General', consultorio: 102}
            ];

            (doctorService.getAllDoctors as jest.Mock).mockResolvedValue(doctors)  
            
            await doctorController.getAllDoctors(mockReq, mockRes)

            expect(doctorService.getAllDoctors).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith(doctors)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('It should return an error', async () =>{
            const error = new Error('Internal Server error');
            (doctorService.getAllDoctors as jest.Mock).mockRejectedValue(error)
            
            await doctorController.getAllDoctors(mockReq, mockRes)

            expect(doctorService.getAllDoctors).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith({message: "Error getting all doctors"})
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe('createDoctor', () => {
        it('It should create a doctor', async () =>{
            const doctorRes: Doctor = {id_doctor: 1, nombre: 'Pepito', apellido: 'Perez', especialidad: 'Pediatria', consultorio: 101}
            const doctorReq: DoctorReq = {
                nombre: 'Pepito',
                apellido: 'Perez',
                especialidad: 'Pediatria',
                consultorio: 101,
            };

            (mockReq.body as DoctorReq) = doctorReq;
            (doctorService.createDoctor as jest.Mock).mockResolvedValue(doctorRes)

            await doctorController.createDoctor(mockReq, mockRes)

            expect(doctorService.createDoctor).toHaveBeenCalledWith(doctorReq)
            expect(mockRes.json).toHaveBeenCalledWith(doctorRes)
            expect(mockRes.status).toHaveBeenCalledWith(201)
        })

        it('It should return an error 400', async () =>{
            const error = new Error('Internal Server Error');
            (mockReq.body) = {};
            (doctorService.createDoctor as jest.Mock).mockRejectedValue(error)

            await doctorController.createDoctor(mockReq, mockRes)

            expect(doctorService.createDoctor).toHaveBeenCalledWith({})
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal Server Error' })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe('getDoctorById', () => {
        it('It should get doctor by id', async () =>{
            const doctorRes: Doctor = {id_doctor: 1, nombre: 'Pepito', apellido: 'Perez', especialidad: 'Pediatria', consultorio: 101};
            (mockReq.params) = {id: '1'};
            (doctorService.getDoctorById as jest.Mock).mockResolvedValue(doctorRes)

            await doctorController.getDoctorById(mockReq, mockRes)

            expect(doctorService.getDoctorById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith(doctorRes)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('It should return an error 400 if doctor not found', async () =>{
            (mockReq.params) = { id: "1" };
            (doctorService.getDoctorById as jest.Mock).mockResolvedValue(null)

            await doctorController.getDoctorById(mockReq, mockRes)

            expect(doctorService.getDoctorById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Record has not found yet" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })

        it('It should return an error 400 if error', async () =>{
            const error = new Error('Internal server error');
            (mockReq.params) = {id: '1'};
            (doctorService.getDoctorById as jest.Mock).mockRejectedValue(error)

            await doctorController.getDoctorById(mockReq, mockRes)

            expect(doctorService.getDoctorById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to retrieve doctor' })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe('updateDoctor', () => {
        it('It should get update doctor', async () =>{
            const doctorRes: Doctor = {id_doctor: 1, nombre: 'Juanito', apellido: 'Test', especialidad: 'Medicina General', consultorio: 101};
            const doctorReq: Partial<DoctorReq> = {
                nombre: 'Juanito',
                apellido: 'Test',
                especialidad: 'Medicina General',
            };
                
            (mockReq.params) = {id: '1'};
            (mockReq.body as Partial<DoctorReq>) = doctorReq;
            (doctorService.updateDoctor as jest.Mock).mockResolvedValue(doctorRes)
    
            await doctorController.updateDoctor(mockReq, mockRes)
    
            expect(doctorService.updateDoctor).toHaveBeenCalledWith(1,doctorReq)
            expect(mockRes.json).toHaveBeenCalledWith(doctorRes)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('It should return an error 400 if doctor not found', async () =>{
            const doctorReq: Partial<DoctorReq> = {
                nombre: 'Juanito',
                apellido: 'Test',
                especialidad: 'Medicina General',
            };
            (mockReq.params) = { id: "1" };
            (mockReq.body as Partial<DoctorReq>) = doctorReq;
            (doctorService.updateDoctor as jest.Mock).mockResolvedValue(null)

            await doctorController.updateDoctor(mockReq, mockRes)

            expect(doctorService.updateDoctor).toHaveBeenCalledWith(1,doctorReq)
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to update Doctor" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe('deleteDoctor', () => {
        it('It should delete doctor', async () =>{
            (mockReq.params) = {id: '1'};
            (doctorService.deleteDoctor as jest.Mock).mockResolvedValue("Doctor was deleted")
    
            await doctorController.deleteDoctor(mockReq, mockRes)
    
            expect(doctorService.deleteDoctor).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({message: "Doctor was deleted"})
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('It should return an error 400 delete doctor', async () =>{
            const error = new Error('Internal server error');
            (mockReq.params) = {id: '1'};
            (doctorService.deleteDoctor as jest.Mock).mockRejectedValue(error)
    
            await doctorController.deleteDoctor(mockReq, mockRes)
    
            expect(doctorService.deleteDoctor).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({error: "Failed to delete doctor"})
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })
})