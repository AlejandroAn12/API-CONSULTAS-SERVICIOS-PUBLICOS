import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { EndpointPrecioService } from './plan.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('endpoint-precios')
export class EndpointPrecioController {
    constructor(private readonly endpointPrecioService: EndpointPrecioService) { }

    // Crear nuevo endpoint con costo
    @Post()
    create(@Body() body: { endpoint: string; method: string; costo: number }) {
        return this.endpointPrecioService.create(body);
    }

    // Listar todos
    @Get()
    findAll() {
        return this.endpointPrecioService.findAll();
    }

    // Buscar uno por ID
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.endpointPrecioService.findOne(id);
    }

    // Actualizar endpoint
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() body: { endpoint?: string; method?: string; costo?: number },
    ) {
        return this.endpointPrecioService.update(id, body);
    }

    // Eliminar endpoint
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.endpointPrecioService.remove(id);
    }
}
