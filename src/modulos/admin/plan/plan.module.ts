import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';

@Module({
    imports: [PrismaModule],
    exports: [PlanService],
    providers: [
        PlanService
    ],
    controllers: [
        PlanController
    ]
})
export class PlanModule { }
