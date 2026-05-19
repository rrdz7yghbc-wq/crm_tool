import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { PrismaService } from '../prisma.service';
import { CustomerService } from './customer.service';

@Module({
    imports: [],
    controllers: [CustomerController],
    providers: [CustomerService, PrismaService],
})
export class CustomerModule {}
