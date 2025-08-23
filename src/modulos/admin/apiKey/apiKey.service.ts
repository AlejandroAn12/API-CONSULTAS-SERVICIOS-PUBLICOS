import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class ApiKeyService {
  constructor(private prisma: PrismaService) { }

  // 🔹 Listar API Keys de un usuario
  async listByUser(userId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: { apiKeys: true },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return usuario.apiKeys;
  }

  // Revocar/Desactivar una API Key
  async revoke(apiKeyId: number, userId: string) {
    // Validar que la API Key existe y pertenece al usuario
    const apiKey = await this.prisma.apiKey.findFirst({
      where: { id: apiKeyId, usuarioId: userId },
    });

    if (!apiKey) {
      throw new NotFoundException('API Key no encontrada para este usuario');
    }

    await this.prisma.apiKey.update({
      where: { id: apiKeyId },
      data: { isActive: false },
    });

    return {
      message: 'API-KEY inhabilitada.'
    }
  }
}
