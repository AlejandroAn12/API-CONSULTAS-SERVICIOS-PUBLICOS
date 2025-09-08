import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PlanService {
    constructor(private prisma: PrismaService) { }

    async getAllPlans() {

        try {
            const results = await this.prisma.plan.findMany({
                select: {
                    id: true,
                    nombre: true,
                    descripcion: true,
                    precio: true,
                    duracionDias: true
                },
                where: {
                    estado: true
                }
            });

            return results;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error retrieving plans: ${error.message}`);
            }
        }
    }
}