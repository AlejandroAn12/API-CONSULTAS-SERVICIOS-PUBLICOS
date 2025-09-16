import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UsuariosService } from '../services/usuarios.service';
import { ApiTags } from '@nestjs/swagger';
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

    //Obtener supcripciones de usuarios
    // @Get('subcripciones/:userId')
    // getUserSubscription(@Param('userId') userId: string){
    //     return this.usuarioService.getUserSubscription(userId);
    // }

    @Get('profile')
    profile(@Req() req) {
        const user = req.user.sub;
        return this.usuarioService.profile(user);
    }
}
