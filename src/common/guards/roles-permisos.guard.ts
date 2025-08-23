import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';
import { JwtPayload } from '../decorators/jwt-payload.interface';
import { PERMISOS_KEY } from '../decorators/permisos.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesPermisosGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const requiredPermisos = this.reflector.getAllAndOverride<string[]>(PERMISOS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as JwtPayload;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: { id: user.sub },
      include: {
        usuarioRol: {
          include: {
            rol: {
              include: {
                rolPermisos: {
                  include: { permiso: true },
                },
              },
            },
          },
        },
      },
    });

    if (!usuario) {
      throw new ForbiddenException('Usuario no encontrado');
    }

    const rolesUsuario = usuario.usuarioRol.map(ur => ur.rol.nombre);
    const permisosUsuario = usuario.usuarioRol.flatMap(ur =>
      ur.rol.rolPermisos.map(rp => rp.permiso.nombre),
    );

    const tieneRol = requiredRoles?.some(r => rolesUsuario.includes(r)) ?? false;
    const tienePermiso = requiredPermisos?.some(p => permisosUsuario.includes(p)) ?? false;

    if (requiredRoles && !tieneRol && !tienePermiso) {
      throw new ForbiddenException('No tienes los roles o permisos requeridos');
    }

    return true;
  }
}