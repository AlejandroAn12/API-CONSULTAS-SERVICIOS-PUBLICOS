import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { PlanService } from "./plan.service";
import { Public } from "src/common/decorators/public.decorator";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('plans')
export class PlanController {
    constructor(private readonly planService: PlanService) { }

    @Get('all')
    getAllPlans() {
        return this.planService.getAllPlans();
    }
}