import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class ApiKeyService {
  constructor(private prisma: PrismaService) { }

  // Crear API Key con vigencia en días
  async create(userId: string, system: string, durationDays: number) {
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

    return this.prisma.apiKey.create({
      data: {
        key: randomBytes(32).toString('hex'),
        system,
        usuarioId: userId,
        expiresAt,
      },
    });
  }

  // 🔹 Listar API Keys de un usuario
  async listByUser(userId: string) {
    try {
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: userId },
        include: { apiKeys: true },
      });

      if (!usuario) throw new NotFoundException('Usuario no encontrado');

      return usuario.apiKeys;
    } catch (error) {
      console.error(error)
    }
  }

  // 🔹 Revocar (desactivar) una API Key
  async revoke(apiKeyId: number, userId: string) {
    try {
      const apiKey = await this.prisma.apiKey.findFirst({
        where: { id: apiKeyId, usuarioId: userId, isActive: true },
      });

      if (!apiKey) {
        throw new NotFoundException('API Key no encontrada o ya revocada');
      }

      await this.prisma.apiKey.update({
        where: { id: apiKeyId },
        data: { isActive: false },
      });

      return {
        message: 'La key ha sido revocada'
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Ha ocurrido un error interno al desactivar la key');
    }
  }


  // 🔹 Renovar una API Key (extiende la vigencia)
  async renew(apiKeyId: number, userId: string, days: number) {

    try {
      const apiKey = await this.prisma.apiKey.findFirst({
        where: { id: apiKeyId, usuarioId: userId},
      });

      if (!apiKey) throw new NotFoundException('API Key no encontrada o inactiva');

      await this.prisma.apiKey.update({
        where: { id: apiKeyId },
        data: {
          isActive: true,
          expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
        },
      });

      return {
        message: 'Key renovada por ' + days
      }

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Ha ocurrido un error interno al renovar la key');
    }
  }

  async getKeyActive(userId: string) {

    try {
      const user = await this.prisma.usuario.findUnique({
        where: { id: userId },
        select: { id: true }
      });

      if (!user) {
        throw new NotFoundException({
          statusCode: 404,
          message: 'Usuario no encontrado o inválido',
          errorCode: 'USER_NOT_FOUND'
        });
      }

      const keyUser = await this.prisma.apiKey.findFirst({
        where: { usuarioId: userId, isActive: true }
      });

      if (!keyUser) {
        throw new NotFoundException({
          statusCode: 404,
          message: 'No se encontraron keys activas',
          errorCode: 'KEY_NOT_FOUND'
        })
      }
      return keyUser;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Ha ocurrido un error interno al obtener la key');
    }
  }

  // // Listar API Keys de un usuario
  // async listByUser(userId: string) {
  //   const usuario = await this.prisma.usuario.findUnique({
  //     where: { id: userId },
  //     include: { apiKeys: true },
  //   });

  //   if (!usuario) {
  //     throw new NotFoundException('Usuario no encontrado');
  //   }

  //   return usuario.apiKeys;
  // }

  // // Revocar/Desactivar una API Key
  // async revoke(apiKeyId: number, userId: string) {
  //   // Validar que la API Key existe y pertenece al usuario
  //   const apiKey = await this.prisma.apiKey.findFirst({
  //     where: { id: apiKeyId, usuarioId: userId },
  //   });

  //   if (!apiKey) {
  //     throw new NotFoundException('API Key no encontrada para este usuario');
  //   }

  //   await this.prisma.apiKey.update({
  //     where: { id: apiKeyId },
  //     data: { isActive: false },
  //   });

  //   return {
  //     message: 'API-KEY inhabilitada.'
  //   }
  // }
}
