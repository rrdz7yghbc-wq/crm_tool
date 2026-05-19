import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Patient } from '.prisma/client/wasm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Controller()
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Get('getAllPatients')
    async getAllPatients(): Promise<Patient[]> {
        return await this.customerService.getAllPatients();
    }

    @Get('getPatientById/:id')
    async getPatientById(@Param('id', ParseIntPipe) id: number): Promise<Patient | null> {
        return await this.customerService.getPatientById(id);
    }

    @Post('insertPatient')
    async insertPatient(@Body() request: CreatePatientDto): Promise<Patient> {
        return await this.customerService.insertPatient(request); // Implementation for inserting a patient would go here
    }

    @Put('updatePatientById/:id')
    async updatePatientById(
        @Param('id', ParseIntPipe) id: number,
        @Body() request: UpdatePatientDto,
    ): Promise<Patient> {
        return await this.customerService.updatePatientById(id, request); // Implementation for updating a patient would go here
    }

    @Delete('deletePatientById/:id')
    async deletePatientById(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.customerService.deletePatientById(id);
    }
}
