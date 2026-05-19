import { Injectable } from '@nestjs/common';
import { Patient } from '@prisma/client';
import { PrismaService } from './prisma.service';

export type { Patient } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getPatients(): Promise<Patient[]> {
    return this.prisma.patient.findMany();
  }
}
