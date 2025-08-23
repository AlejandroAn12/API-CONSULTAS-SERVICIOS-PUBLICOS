import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsuariosService } from '../services/usuarios.service';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UsuarioDTO } from '../dto/usuario.dto';

//@ApiExcludeController() // Excluye el controlador de la documentación de Swagger
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuariosController {

    constructor(private readonly usuarioService: UsuariosService) { }

    //Crear un nuevo usuario
    @Post('crear')
    crearUsuario(@Body() usuarioDto: UsuarioDTO) {
        return this.usuarioService.crearUsuario(usuarioDto);
    }

    //Obtener todos los usuarios
    // @Public()
    @Get('obtener')
    obtenerUsuarios() {
        return this.usuarioService.obtenerUsuarios();
    }
}
