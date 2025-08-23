import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PermisoDTO } from '../dto/permiso.dto';

@Injectable()
export class RolesPermisosService {
    constructor(private readonly prismaService: PrismaService) { }



    //Metodos para la gestion de permisos
    async crearPermiso(permisoDto: PermisoDTO) {
        const { nombre, descripcion } = permisoDto;

        try {
            const permisoExiste = await this.prismaService.permiso.findFirst({
                where: { nombre },
            });

            if (permisoExiste) {
                throw new BadRequestException('El permiso ya existe');
            }

            await this.prismaService.permiso.create({
                data: {
                    nombre,
                    descripcion,
                },
            });

            return {
                ok: true,
                mensaje: 'Permiso creado correctamente',
            }

        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            // Manejo de errores genérico
            if (error instanceof Error) {
                throw error;
            }
        }
    }

    // Obtener todos los permisos
    async obtenerPermisos() {
        try {
            const permisos = await this.prismaService.permiso.findMany();
            if (!permisos || permisos.length === 0) {
                throw new NotFoundException('No se encontraron permisos');
            }
            // Mapeo para transformar los datos antes de devolverlos
            const permisosMap = permisos.map(permiso => ({ id: permiso.id, nombre: permiso.nombre, descripcion: permiso.descripcion }));
            // Devolver los permisos obtenidos
            return {
                ok: true,
                data: permisosMap,
            };

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            // Manejo de errores genérico
            throw new BadRequestException('Error al obtener los permisos');
        }
    }

    // Obtener un permiso por ID
    async obtenerPermisoPorId(id: string) {
        try {
            const permiso = await this.prismaService.permiso.findUnique({
                where: { id },
            });

            if (!permiso) {
                throw new NotFoundException('El permiso no existe');
            }

            return {
                ok: true,
                data: permiso,
            };

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            // Manejo de errores genérico
            throw new BadRequestException('Error al obtener el permiso');
        }
    }

    // Actualizar un permiso por ID
    async actualizarPermiso(id: string, permisoDto: PermisoDTO) {
        const { nombre, descripcion } = permisoDto;

        try {
            const permiso = await this.prismaService.permiso.findUnique({
                where: { id },
            });

            if (!permiso) {
                throw new NotFoundException('El permiso no existe');
            }

            await this.prismaService.permiso.update({
                where: { id },
                data: { nombre, descripcion },
            });

            return {
                ok: true,
                mensaje: 'Permiso actualizado correctamente',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            // Manejo de errores genérico
            throw new BadRequestException('Error al actualizar el permiso');
        }
    }

    // Eliminar un permiso por ID
    async eliminarPermiso(id: string) {
        try {
            const permiso = await this.prismaService.permiso.findUnique({
                where: { id },
            });

            if (!permiso) {
                throw new NotFoundException('El permiso no existe');
            }

            await this.prismaService.permiso.delete({
                where: { id },
            });

            return {
                ok: true,
                mensaje: 'Permiso eliminado correctamente',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            // Manejo de errores genérico
            throw new BadRequestException('Error al eliminar el permiso');
        }
    }


    // Asignar permiso a rol
    async asignarPermisoARol(rolId: string, permisoId: string) {
        // Verificar existencia
        const rol = await this.prismaService.rol.findUnique({ where: { id: rolId } });
        if (!rol) throw new NotFoundException('Rol no encontrado');

        const permiso = await this.prismaService.permiso.findUnique({ where: { id: permisoId } });
        if (!permiso) throw new NotFoundException('Permiso no encontrado');

        // Verificar si ya existe
        const existe = await this.prismaService.rolesPermisos.findUnique({
            where: { rolId_permisoId: { rolId, permisoId } },
        });
        if (existe) throw new BadRequestException('Permiso ya asignado a este rol');

        // Crear relación
        await this.prismaService.rolesPermisos.create({
            data: { rolId, permisoId },
        });

        return {
            ok: true,
            mensaje: 'Permiso asignado correctamente al rol',
        };
    }

    // Asignar rol a usuario
    // async asignarRolAUsuario(usuarioId: string, rolId: string) {
    //     // Verificar existencia
    //     const usuario = await this.prismaService.usuario.findUnique({ where: { id: usuarioId } });
    //     if (!usuario) throw new NotFoundException('Usuario no encontrado');

    //     const rol = await this.prismaService.rol.findUnique({ where: { id: rolId } });
    //     if (!rol) throw new NotFoundException('Rol no encontrado');

    //     // Verificar si ya está asignado
    //     const existe = await this.prismaService.usuarioRol.findUnique({
    //         where: { usuarioId_rolId: { usuarioId, rolId } },
    //     });
    //     if (existe) throw new BadRequestException('Rol ya asignado a este usuario');

    //     // Crear relación
    //     await this.prismaService.usuarioRol.create({
    //         data: { usuarioId, rolId },
    //     });

    //     return {
    //         ok: true,
    //         mensaje: 'Rol asignado correctamente al usuario',
    //     };
    // }

    /**
   * Verifica si un usuario tiene un permiso específico por nombre
   */
    // async usuarioTienePermiso(usuarioId: string, nombrePermiso: string): Promise<boolean> {
    //     const rolesDelUsuario = await this.prismaService.usuarioRol.findMany({
    //         where: { usuarioId },
    //         include: {
    //             rol: {
    //                 include: {
    //                     rolPermisos: {
    //                         include: {
    //                             permiso: true,
    //                         },
    //                     },
    //                 },
    //             },
    //         },
    //     });

    //     for (const userRol of rolesDelUsuario) {
    //         const permisos = userRol.rol.rolPermisos.map((rp) => rp.permiso.nombre);
    //         if (permisos.includes(nombrePermiso)) {
    //             return true;
    //         }
    //     }

    //     return false;
    // }
}
