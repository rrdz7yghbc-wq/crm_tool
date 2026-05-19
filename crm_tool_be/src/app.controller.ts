import { Controller, Get } from '@nestjs/common';
import { AppService, Patient } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('patients')
  async getPatients(): Promise<Patient[]> {
    return await this.appService.getPatients();
  }
}
