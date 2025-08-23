import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolDTO } from '../dto/rol.dto';
import { PermisoDTO } from '../dto/permiso.dto';

@Injectable()
export class RolesService {

    constructor(private readonly prismaService: PrismaService) { }

    //Crear un nuevo rol
    async crearRol(rolDto: RolDTO) {
        const { nombre } = rolDto;

        try {
            const rolExiste = await this.prismaService.rol.findFirst({
                where: { nombre },
            });

            if (rolExiste) {
                throw new BadRequestException('El rol ya existe');
            }

            await this.prismaService.rol.create({
                data: {
                    nombre,
                },
            });

            return {
                ok: true,
                mensaje: 'Rol creado correctamente',
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

    // Obtener todos los roles
    async obtenerRoles() {
        try {
            const roles = await this.prismaService.rol.findMany();
            if (!roles || roles.length === 0) {
                throw new NotFoundException('No se encontraron roles');
            }
            // Mapeo para transformar los datos antes de devolverlos
            const rolesMap = roles.map(rol => ({ id: rol.id, nombre: rol.nombre, descripcion: rol.descripcion }));
            // Devolver los roles obtenidos
            return {
                ok: true,
                data: rolesMap,
            };

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            // Manejo de errores genérico
            throw new BadRequestException('Error al obtener los roles');
        }
    }

    // Obtener un rol por ID
    async obtenerRolPorId(id: string) {
        try {
            const rol = await this.prismaService.rol.findUnique({
                where: { id },
            });

            if (!rol) {
                throw new NotFoundException('El rol no existe');
            }

            return {
                ok: true,
                data: rol,
            };

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            // Manejo de errores genérico
            throw new BadRequestException('Error al obtener el rol');
        }
    }

    // Actualizar un rol por ID
    async actualizarRol(id: string, rolDto: RolDTO) {
        const { nombre } = rolDto;

        try {
            const rol = await this.prismaService.rol.findUnique({
                where: { id },
            });

            if (!rol) {
                throw new NotFoundException('El rol no existe');
            }

            await this.prismaService.rol.update({
                where: { id },
                data: { nombre },// Agregar la descripción aquí si es necesario
            });

            return {
                ok: true,
                mensaje: 'Rol actualizado correctamente',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            // Manejo de errores genérico
            throw new BadRequestException('Error al actualizar el rol');
        }
    }

    // Eliminar un rol por ID
    async eliminarRol(id: string) {
        try {
            const rol = await this.prismaService.rol.findUnique({
                where: { id },
            });

            if (!rol) {
                throw new NotFoundException('El rol no existe');
            }

            await this.prismaService.rol.delete({
                where: { id },
            });

            return {
                ok: true,
                mensaje: 'Rol eliminado correctamente',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            // Manejo de errores genérico
            throw new BadRequestException('Error al eliminar el rol');
        }
    }
    
    /**
   * Obtener todos los roles asignados a un usuario
   */
  async obtenerRolesPorUsuario(usuarioId: string) {
    const usuario = await this.prismaService.usuario.findUnique({
      where: { id: usuarioId },
      include: {
        usuarioRol: {
          include: {
            rol: true,
          },
        },
      },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario.usuarioRol.map((ur) => ur.rol);
  }

 

}
