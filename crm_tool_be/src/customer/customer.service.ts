import { Injectable } from '@nestjs/common';
import { Patient } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class CustomerService {
    constructor(private readonly prisma: PrismaService) {}

    private normalizeId(id: number | string): number {
        return typeof id === 'string' ? parseInt(id, 10) : id;
    }

    async getAllPatients(): Promise<Patient[]> {
        return this.prisma.patient.findMany();
    }

    async getPatientById(id: number | string): Promise<Patient | null> {
        const patientId = this.normalizeId(id);
        return await this.prisma.patient.findUnique({ where: { id: patientId } });
    }

    async insertPatient(request: CreatePatientDto): Promise<Patient> {
        return await this.prisma.patient.create({ data: request });
    }

    async updatePatientById(id: number | string, request: UpdatePatientDto): Promise<Patient> {
        const patientId = this.normalizeId(id);
        return await this.prisma.patient.update({ where: { id: patientId }, data: request });
    }

    async deletePatientById(id: number | string): Promise<void> {
        const patientId = this.normalizeId(id);
        await this.prisma.patient.delete({ where: { id: patientId } });
    }
}
