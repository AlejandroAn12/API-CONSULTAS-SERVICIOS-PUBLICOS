import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsuariosService } from '../services/usuarios.service';
import { UsuarioDTO } from '../dto/usuario.dto';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';

//@ApiExcludeController() // Excluye el controlador de la documentación de Swagger
@UseGuards(JwtAuthGuard)
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
