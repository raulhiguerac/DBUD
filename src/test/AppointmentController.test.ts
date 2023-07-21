import { Request, Response } from "express"
import { AppoinmentController, AppoinmentControllerImpl } from "../api/components/citas/controller"
import { AppoinmentService, AppoinmentServiceImpl } from "../api/components/citas/service"
import { Appoinment, AppoinmentReq } from "../api/components/citas/model"

const mockReq = {} as Request
const mockRes = {} as Response

describe('AppoinmentController', () =>{
    let appoinmentService: AppoinmentService
    let appoinmentController : AppoinmentController

    beforeEach( () => {
        appoinmentService = {
            createAppoinment: jest.fn(),
            getAllAppoinment: jest.fn(),
            getAppoinmentById: jest.fn(),
            updateAppoinment: jest.fn(),
            deleteAppoinment: jest.fn()
        }
        appoinmentController = new AppoinmentControllerImpl(appoinmentService)
        mockRes.status = jest.fn().mockReturnThis()
        mockRes.json = jest.fn().mockReturnThis()
    })

    describe('getAllAppoinment', () => {
        it('It should return All Appoinment', async () =>{
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

            (appoinmentService.getAllAppoinment as jest.Mock).mockResolvedValue(appoinments)  
            
            await appoinmentController.getAllAppoinment(mockReq, mockRes)

            expect(appoinmentService.getAllAppoinment).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith(appoinments)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('It should return an error', async () =>{
            (appoinmentService.getAllAppoinment as jest.Mock).mockRejectedValue("Error getting all appoinments")
            
            await appoinmentController.getAllAppoinment(mockReq, mockRes)

            expect(appoinmentService.getAllAppoinment).toHaveBeenCalled()
            expect(mockRes.json).toHaveBeenCalledWith({message: "Error getting all appoinments"})
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe('createDoctor', () => {
        it('It should create a doctor', async () =>{
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

            (mockReq.body as AppoinmentReq) = appoinmentReq;
            (appoinmentService.createAppoinment as jest.Mock).mockResolvedValue(appoinmetRes)

            await appoinmentController.createAppoinment(mockReq, mockRes)

            expect(appoinmentService.createAppoinment).toHaveBeenCalledWith(appoinmentReq)
            expect(mockRes.json).toHaveBeenCalledWith(appoinmetRes)
            expect(mockRes.status).toHaveBeenCalledWith(201)
        })

        it('It should return an error 400', async () =>{
            const error = new Error('Internal Server Error');
            (mockReq.body) = {};
            (appoinmentService.createAppoinment as jest.Mock).mockRejectedValue(error)

            await appoinmentController.createAppoinment(mockReq, mockRes)

            expect(appoinmentService.createAppoinment).toHaveBeenCalledWith({})
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal Server Error' })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe('getAppoinmentById', () => {
        it('It should get appoinment by id', async () =>{
            const appoinmetRes: Appoinment = 
            {
                identificacion_paciente: "123456789",
                especialidad: "Medicina general",
                doctor: "1",
                consultorio: 101,
                horario: "7:30"
            };
            (mockReq.params) = {id: '1'};
            (appoinmentService.getAppoinmentById as jest.Mock).mockResolvedValue(appoinmetRes)

            await appoinmentController.getAppoinmentById(mockReq, mockRes)

            expect(appoinmentService.getAppoinmentById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith(appoinmetRes)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('It should return an error 400 if appoinment not found', async () =>{
            (mockReq.params) = { id: "1" };
            (appoinmentService.getAppoinmentById as jest.Mock).mockResolvedValue(null)

            await appoinmentController.getAppoinmentById(mockReq, mockRes)

            expect(appoinmentService.getAppoinmentById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Record has not found yet" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })

        it('It should return an error 400 if error', async () =>{
            const error = new Error('Internal server error');
            (mockReq.params) = {id: '1'};
            (appoinmentService.getAppoinmentById as jest.Mock).mockRejectedValue(error)

            await appoinmentController.getAppoinmentById(mockReq, mockRes)

            expect(appoinmentService.getAppoinmentById).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Failed to retrieve appoinment' })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe('updateDoctor', () => {
        it('It should get update doctor', async () =>{
            const appoinmetRes: Appoinment = 
            {
                identificacion_paciente: "123456789",
                especialidad: "Medicina general",
                doctor: "1",
                consultorio: 101,
                horario: "7:30"
            };
            const appoinmentReq: Partial<AppoinmentReq> = 
            {
                identificacion_paciente: "123456789",
                especialidad: "Medicina general",
                id_doctor: 1,
            };
                
            (mockReq.params) = {id: '1'};
            (mockReq.body as Partial<AppoinmentReq>) = appoinmentReq;
            (appoinmentService.updateAppoinment as jest.Mock).mockResolvedValue(appoinmetRes)
    
            await appoinmentController.updateAppoinment(mockReq, mockRes)
    
            expect(appoinmentService.updateAppoinment).toHaveBeenCalledWith(1,appoinmentReq)
            expect(mockRes.json).toHaveBeenCalledWith(appoinmetRes)
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('It should return an error 400 if doctor not found', async () =>{
            const appoinmentReq: Partial<AppoinmentReq> = {
                identificacion_paciente: "123456789",
                especialidad: "Medicina general",
                id_doctor: 1,
            };
            (mockReq.params) = { id: "1" };
            (mockReq.body as Partial<AppoinmentReq>) = appoinmentReq;
            (appoinmentService.updateAppoinment as jest.Mock).mockResolvedValue(null)

            await appoinmentController.updateAppoinment(mockReq, mockRes)

            expect(appoinmentService.updateAppoinment).toHaveBeenCalledWith(1,appoinmentReq)
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to update Citas" })
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })

    describe('deleteAppoinment', () => {
        it('It should delete appoinment', async () =>{
            (mockReq.params) = {id: '1'};
            (appoinmentService.deleteAppoinment as jest.Mock).mockResolvedValue("Appoinment was deleted")
    
            await appoinmentController.deleteAppoinment(mockReq, mockRes)
    
            expect(appoinmentService.deleteAppoinment).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({message: "Appoinment was deleted"})
            expect(mockRes.status).toHaveBeenCalledWith(200)
        })

        it('It should return an error 400 delete appoinment', async () =>{
            const error = new Error('Internal server error');
            (mockReq.params) = {id: '1'};
            (appoinmentService.deleteAppoinment as jest.Mock).mockRejectedValue(error)
    
            await appoinmentController.deleteAppoinment(mockReq, mockRes)
    
            expect(appoinmentService.deleteAppoinment).toHaveBeenCalledWith(1)
            expect(mockRes.json).toHaveBeenCalledWith({error: "Failed to delete appoinment"})
            expect(mockRes.status).toHaveBeenCalledWith(400)
        })
    })
})