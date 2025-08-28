import { Injectable, NotFoundException } from '@nestjs/common';
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
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: { apiKeys: true },
    });

    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    return usuario.apiKeys;
  }

  // 🔹 Revocar (desactivar) una API Key
  async revoke(apiKeyId: number, userId: string) {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: { id: apiKeyId, usuarioId: userId },
    });

    if (!apiKey) throw new NotFoundException('API Key no encontrada');

    return this.prisma.apiKey.update({
      where: { id: apiKeyId },
      data: { isActive: false },
    });
  }

  // 🔹 Renovar una API Key (extiende la vigencia)
  async renew(apiKeyId: number, userId: string, days: number) {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: { id: apiKeyId, usuarioId: userId, isActive: true },
    });

    if (!apiKey) throw new NotFoundException('API Key no encontrada o inactiva');

    return this.prisma.apiKey.update({
      where: { id: apiKeyId },
      data: {
        expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      },
    });
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
