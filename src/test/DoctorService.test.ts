import { Request, Response } from "express"
import { DoctorService, DoctorServiceImpl } from "../api/components/doctores/service"
import { DoctorRepository } from "../api/components/doctores/repository"
import { Doctor, DoctorReq } from "../api/components/doctores/model"

const mockReq = {} as Request
const mockRes = {} as Response

describe('DoctorService', ()=>{
    let doctorRepository: DoctorRepository
    let doctorService: DoctorService

    beforeEach( () => {
        doctorRepository = {
            getAllDoctors: jest.fn(),
            createDoctor: jest.fn(),
            getDoctorById: jest.fn(),
            updateDoctor: jest.fn(),
            deleteDoctor: jest.fn()
        }
        doctorService = new DoctorServiceImpl(doctorRepository)
    })

    describe('getAllDoctors', () =>{
        it('It should get all doctors from service', async () =>{
            const doctors: Doctor[] = [
                {id_doctor: 1, nombre: 'Pepito', apellido: 'Perez', especialidad: 'Pediatria', consultorio: 101},
                {id_doctor: 2, nombre: 'Juanito', apellido: 'Perez', especialidad: 'Medicina General', consultorio: 102}
            ];

            (doctorRepository.getAllDoctors as jest.Mock).mockResolvedValue(doctors)

            const result = await doctorService.getAllDoctors()

            expect(doctorRepository.getAllDoctors).toHaveBeenCalled()
            expect(result).toEqual(doctors)
        })

        it('It should return an empty array', async () =>{
            const doctors: Doctor[] = [];

            (doctorRepository.getAllDoctors as jest.Mock).mockResolvedValue(doctors)

            const result = await doctorService.getAllDoctors()

            expect(doctorRepository.getAllDoctors).toHaveBeenCalled()
            expect(result).toEqual([])
        })
    })

    describe('createDoctor', () =>{
        it('It should create a doctor from service', async () =>{
            const doctorReq: DoctorReq = {
                nombre: 'Pepito',
                apellido: 'Perez',
                especialidad: 'Pediatria',
                consultorio: 101,
            }
            const doctorRes: Doctor = {id_doctor: 1, nombre: 'Pepito', apellido: 'Perez', especialidad: 'Pediatria', consultorio: 101};

            (doctorRepository.createDoctor as jest.Mock).mockResolvedValue(doctorRes)

            const result = await doctorService.createDoctor(doctorReq)

            expect(doctorRepository.createDoctor).toHaveBeenCalledWith(doctorReq)
            expect(result).toEqual(doctorRes)
        })

        it('It should return an error 400 from service', async () =>{
            const doctorReq: DoctorReq = {
                nombre: 'Pepito',
                apellido: 'Perez',
                especialidad: 'Pediatria',
                consultorio: 101,
            }
            const error = new Error('Failed to create a doctor');
            (doctorRepository.createDoctor as jest.Mock).mockRejectedValue(error)


            await expect(doctorService.createDoctor(doctorReq)).rejects.toThrowError(error)
            expect(doctorRepository.createDoctor).toHaveBeenCalledWith(doctorReq)
        })
    })

    describe('getDoctorById', () =>{
        it('It should get doctor by id', async () =>{
            const doctorId = 1;
            const doctorRes: Doctor = {id_doctor: 1, nombre: 'Pepito', apellido: 'Perez', especialidad: 'Pediatria', consultorio: 101};

            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(doctorRes)

            const result = await doctorService.getDoctorById(doctorId)

            expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(doctorId)
            expect(result).toEqual(doctorRes)
        })

        it('should return an empty array when no doctors are found', async () => {
            const doctorId = 1;
            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(null)

            const result  = await doctorService.getDoctorById(doctorId)

            expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(doctorId)
            expect(result).toBeNull()
        })

        it('should throw an error if retrieval fails', async () => {
            const doctorId = 1
            const error = new Error('Database error');
            (doctorRepository.getDoctorById as jest.Mock).mockRejectedValue(error)

            await expect(doctorService.getDoctorById(doctorId)).rejects.toThrowError(error)
            expect(doctorRepository.getDoctorById).toHaveBeenCalledWith(doctorId)
        })
    })

    describe('updateDoctor', () =>{
        it('It should update the doctor', async () =>{
            const doctorId = 1;
            const doctorReq: Doctor = {
                id_doctor: 1,
                nombre: 'Juanito',
                apellido: 'Test',
                especialidad: 'Medicina General',
                consultorio: 101
            }
            const doctorRes: Doctor = {id_doctor: 1, nombre: 'Juanito', apellido: 'Test', especialidad: 'Medicina General', consultorio: 101};
            
            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(doctorRes);
            (doctorRepository.updateDoctor as jest.Mock).mockResolvedValue(doctorRes);

            const result = await doctorService.updateDoctor(doctorId,doctorReq);

            expect(doctorRepository.updateDoctor).toHaveBeenCalledWith(doctorId,doctorReq)
            expect(result).toEqual(doctorRes)
        })

        it('should return an error when no doctor is found', async () => {
            const doctorId = 1;
            const doctorReq: Doctor = {
                id_doctor: 1,
                nombre: 'Juanito',
                apellido: 'Test',
                especialidad: 'Medicina General',
                consultorio: 101
            }
            const error = new Error('Failed to update Doctor');
            (doctorRepository.updateDoctor as jest.Mock).mockRejectedValue(error);

            await expect(doctorService.updateDoctor(doctorId,doctorReq)).rejects.toThrowError(error)
        })
    })

    describe('deleteDoctor', () =>{
        it('It should delete the doctor', async () =>{
            const doctorId = 1;

            const doctorRes: Doctor = {id_doctor: 1, nombre: 'Juanito', apellido: 'Test', especialidad: 'Medicina General', consultorio: 101};
            
            (doctorRepository.getDoctorById as jest.Mock).mockResolvedValue(doctorRes);
            (doctorRepository.deleteDoctor as jest.Mock).mockResolvedValue(undefined);

            const result = await doctorService.deleteDoctor(doctorId);

            expect(doctorRepository.deleteDoctor).toHaveBeenCalledWith(doctorId)
            expect(result).toBeUndefined()
        })

        it('should return an error when no doctor is found', async () => {
            const doctorId = 1;
            const error = new Error('Failed to delete Doctor');
            (doctorRepository.deleteDoctor as jest.Mock).mockRejectedValue(error);

            await expect(doctorService.deleteDoctor(doctorId)).rejects.toThrowError(error)
        })
    })
})