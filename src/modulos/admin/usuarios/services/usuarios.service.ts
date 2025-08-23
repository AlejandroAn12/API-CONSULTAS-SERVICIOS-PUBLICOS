import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsuarioDTO } from '../dto/usuario.dto';
import { HashUtil } from 'src/common/utils/hash.util';

@Injectable()
export class UsuariosService {

    constructor(private readonly prismaService: PrismaService) { }


    //Crear un nuevo usuario
    async crearUsuario(usuarioDto: UsuarioDTO) {
        const { nombres, email, password } = usuarioDto;

        try {
            const usuarioExiste = await this.prismaService.usuario.findUnique({
                where: { email },
            });

            if (usuarioExiste) {
                throw new NotFoundException('El email ya está en uso, pruebe con otro.');
            }

            //hashear el password antes de guardarlo
            const hash = await HashUtil.hashPassword(password);

            await this.prismaService.usuario.create({
                data: {
                    nombres,
                    email,
                    password: hash,
                },
            });

            return {
                ok: true,
                mensaje: 'Usuario creado correctamente'
            };

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Ha ocurrido un error interno al crear el usuario');
        }
    }

    // Obtener todos los usuarios
    async obtenerUsuarios() {
        try {
            const usuarios = await this.prismaService.usuario.findMany({
                select: {
                    id: true,
                    nombres: true,
                    email: true,
                    usuarioRol: {
                        select: {
                            rol: {
                                select: {
                                    id: true,
                                    nombre: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!usuarios || usuarios.length === 0) {
                throw new NotFoundException('No se encontraron usuarios');
            }
            // Mapeo para transformar los datos antes de devolverlos
            const usuariosMap = usuarios.map(usuario => ({
                id: usuario.id,
                nombres: usuario.nombres,
                email: usuario.email,
                roles: usuario.usuarioRol.map(rol => rol.rol),
            }));
            // Devolver los usuarios obtenidos
            return {
                ok: true,
                data: usuariosMap,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            // Manejo de errores genérico
            throw new BadRequestException('Ha ocurrido un error interno al obtener los usuarios');
        }
    }

    async findByEmail(email: string) {
        try {
            const usuario = await this.prismaService.usuario.findUnique({
                where: { email },
            });
            if (!usuario) {
                throw new NotFoundException('Usuario no encontrado');
            }
            return usuario;

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            // Manejo de errores genérico
            throw new BadRequestException('Ha ocurrido un error interno al obtener el usuario');
        }
    }
}
