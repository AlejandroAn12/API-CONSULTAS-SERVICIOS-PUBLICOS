import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    Get,
    Param,
    Delete,
    Put,
} from '@nestjs/common';
import { RolesPermisosService } from '../services/rolesPermisosService.service';
import { CrearRolePermisoDto } from '../dto/crear-rol-permiso.dto';
import { CrearUsuarioRolDto } from '../dto/crear-usuario-rol.dto';
import { PermisoDTO } from '../dto/permiso.dto';
import { ApiTags, ApiExcludeController } from '@nestjs/swagger';

//@ApiExcludeController() // Excluye el controlador de la documentación de Swagger
@ApiTags('Roles y Permisos')
@Controller('seguridad')
export class RolesPermisosController {
    constructor(private readonly rolesPermisosService: RolesPermisosService) { }

    //Controladores para permisos
    @Post('crear-permiso')
    crearPermiso(@Body() permisoDto: PermisoDTO) {
        return this.rolesPermisosService.crearPermiso(permisoDto);
    }

    // Obtener todos los permisos
    @Get('obtener-permisos')
    obtenerPermisos() {
        return this.rolesPermisosService.obtenerPermisos();
    }

    // Obtener un permiso por ID
    @Get('obtener-permiso/:id')
    obtenerPermisoPorId(@Param('id') id: string) {
        return this.rolesPermisosService.obtenerPermisoPorId(id);
    }

    //Actualizar un permiso por ID
    @Put('actualizar-permiso/:id')
    actualizarPermiso(@Param('id') id: string, @Body() permisoDto: PermisoDTO) {
        return this.rolesPermisosService.actualizarPermiso(id, permisoDto);
    }

    //Eliminar un permiso por ID
    @Delete('eliminar-permiso/:id')
    eliminarPermiso(@Param('id') id: string) {
        return this.rolesPermisosService.eliminarPermiso(id);
    }

    @Post('asignar-permiso-a-rol')
    @HttpCode(HttpStatus.CREATED)
    async asignarPermisoARol(@Body() dto: CrearRolePermisoDto) {
        return this.rolesPermisosService.asignarPermisoARol(dto.rolId, dto.permisoId);
    }

    @Post('asignar-rol-a-usuario')
    @HttpCode(HttpStatus.CREATED)
    async asignarRolAUsuario(@Body() dto: CrearUsuarioRolDto) {
        return this.rolesPermisosService.asignarRolAUsuario(dto.usuarioId, dto.rolId);
    }

    //Validar si un usuario tiene un permiso específico
    @Get('validar-permiso/:usuarioId/:permiso')
    async verificarPermiso(
        @Param('usuarioId') usuarioId: string,
        @Param('permiso') permiso: string,
    ) {
        const tienePermiso = await this.rolesPermisosService.usuarioTienePermiso(usuarioId, permiso);
        return { tienePermiso };
    }
}
