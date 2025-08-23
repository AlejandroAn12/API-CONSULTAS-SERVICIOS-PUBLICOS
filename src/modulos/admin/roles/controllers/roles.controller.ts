import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { RolDTO } from '../dto/rol.dto';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';

ApiExcludeController() // Excluye el controlador de la documentación de Swagger
@ApiTags('Roles')
@Controller('roles')
export class RolesController {

    constructor(private readonly rolesService: RolesService) { }

    //Crear un nuevo rol
    @Post('crear')
    crearRol(@Body() rolDto: RolDTO) {
        return this.rolesService.crearRol(rolDto);
    }

    // Obtener todos los roles
    @Get('obtener')
    obtenerRoles() {
        return this.rolesService.obtenerRoles();
    }

    // Obtener un rol por ID
    @Get('obtener/:id')
    obtenerRolPorId(@Param('id') id: string) {
        return this.rolesService.obtenerRolPorId(id);
    }

    //Actualizar un rol por ID
    @Put('actualizar/:id')
    actualizarRol(@Param('id') id: string, @Body() rolDto: RolDTO) {
        return this.rolesService.actualizarRol(id, rolDto);
    }

    //Eliminar un rol por ID
    @Delete('eliminar/:id')
    eliminarRol(@Param('id') id: string) {
        return this.rolesService.eliminarRol(id);
    }

}
