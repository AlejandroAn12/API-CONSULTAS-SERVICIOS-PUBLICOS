import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EndpointPrecioService {
    constructor(private prisma: PrismaService) { }

    // Crear
    async create(data: { endpoint: string; method: string; costo: number }) {
        return this.prisma.endpointPrecio.create({ data });
    }

    // Listar todos
    async findAll() {
        return this.prisma.endpointPrecio.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    // Buscar por ID
    async findOne(id: string) {
        const item = await this.prisma.endpointPrecio.findUnique({ where: { id } });
        if (!item) throw new NotFoundException('EndpointPrecio no encontrado');
        return item;
    }

    // Actualizar
    async update(id: string, data: { endpoint?: string; method?: string; costo?: number }) {
        const exists = await this.prisma.endpointPrecio.findUnique({ where: { id } });
        if (!exists) throw new NotFoundException('EndpointPrecio no encontrado');

        return this.prisma.endpointPrecio.update({
            where: { id },
            data,
        });
    }

    // Eliminar
    async remove(id: string) {
        const exists = await this.prisma.endpointPrecio.findUnique({ where: { id } });
        if (!exists) throw new NotFoundException('EndpointPrecio no encontrado');

        return this.prisma.endpointPrecio.delete({ where: { id } });
    }
}
