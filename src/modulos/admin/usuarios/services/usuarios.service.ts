import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsuarioDTO } from '../dto/usuario.dto';
import { HashUtil } from 'src/common/utils/hash.util';
import { randomBytes } from 'crypto';
import { Role } from 'src/common/enums/role.enum';
import * as moment from 'moment-timezone';


@Injectable()
export class UsuariosService {

    constructor(private readonly prisma: PrismaService) { }


    //Crear un nuevo usuario
    async crearUsuario(usuarioDto: UsuarioDTO) {
        const durationDays = 15;
        const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
        const { nombres, email, password, system } = usuarioDto;
        const newKey = randomBytes(32).toString('hex');


        try {
            const usuarioExiste = await this.prisma.usuario.findUnique({
                where: { email },
            });

            if (usuarioExiste) {
                throw new BadRequestException('El email ya está en uso, pruebe con otro.');
            }

            const rol = await this.prisma.rol.findFirst({
                where: { nombre: Role.USUARIO }
            });

            if (!rol) {
                throw new NotFoundException('Rol no encontrado');
            }

            //hashear el password antes de guardarlo
            const hash = await HashUtil.hashPassword(password);

            const usuarioBD = await this.prisma.usuario.create({
                data: {
                    nombres,
                    roleId: rol.id,
                    email,
                    password: hash,
                },
            });

            //Crear registros en el apikey
            await this.prisma.apiKey.create({
                data: {
                    key: await newKey,
                    system,
                    usuarioId: usuarioBD.id,
                    expiresAt
                }
            });

            return {
                ok: true,
                mensaje: 'Registro exitoso, tienes 15 dias gratis para usar el API'
            };

        } catch (error) {
            console.error('Error=> ', error)
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Ha ocurrido un error interno al crear el usuario');
        }
    }

    // Obtener todos los usuarios
    async obtenerUsuarios() {
        try {
            const usuarios = await this.prisma.usuario.findMany({
                select: {
                    id: true,
                    nombres: true,
                    email: true,
                    role: {
                        select: {
                            nombre: true
                        }
                    }
                },
            });
            if (!usuarios || usuarios.length === 0) {
                throw new NotFoundException('No se encontraron usuarios');
            }

            // Devolver los usuarios obtenidos
            return {
                ok: true,
                data: usuarios,
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
            const usuario = await this.prisma.usuario.findUnique({
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

    //Informacion del perfil
    async profile(userId: string) {

        try {
            const user = await this.prisma.usuario.findUnique({
                where: { id: userId },
                select: {
                    nombres: true,
                    email: true,
                    estado: true,
                    role: {
                        select: {
                            nombre: true
                        }
                    },
                    wallet:{
                        select: {
                            balance: true
                        }
                    }
                }
            });

            if (!user) {
                throw new NotFoundException({
                    statusCode: 404,
                    message: 'Usuario no encontrado',
                    codeError: 'USER_NOT_FOUND'
                });
            }
            return user;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            // Manejo de errores genérico
            throw new BadRequestException('Ha ocurrido un error interno al obtener el usuario');
        }
    }

    // async getUserSubscription(userId: string) {
    //     const suscripcion = await this.prisma.suscripcion.findFirst({
    //         where: { usuarioId: userId, activa: true },
    //         include: { plan: true },
    //     });

    //     if (!suscripcion) return null;

    //     return {
    //         ...suscripcion,
    //         fechaInicioLocal: moment(suscripcion.fechaInicio)
    //             .tz(suscripcion.timeZone)
    //             .format('YYYY-MM-DD HH:mm'),
    //         fechaFinLocal: moment(suscripcion.fechaFin)
    //             .tz(suscripcion.timeZone)
    //             .format('YYYY-MM-DD HH:mm'),
    //     };
    // }

}
