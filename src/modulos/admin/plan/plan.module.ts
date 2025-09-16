import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EndpointPrecioService } from './plan.service';
import { EndpointPrecioController } from './plan.controller';

@Module({
    imports: [PrismaModule],
    providers: [
        EndpointPrecioService
    ],
    controllers: [
        EndpointPrecioController
    ]
})
export class PlanModule { }
