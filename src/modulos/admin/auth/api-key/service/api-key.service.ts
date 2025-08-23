import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class ApiKeyService {
  constructor(private prisma: PrismaService) { }

  async generateApiKey(userId: string): Promise<string> {
    const key = randomBytes(32).toString('hex');

    await this.prisma.apiKey.create({
      data: {
        key,
        usuarioId: userId,
      },
    });

    return key;
  }

  async revokeApiKey(key: string) {
    return this.prisma.apiKey.update({
      where: { key },
      data: { activo: false },
    });
  }

  async validateApiKey(apiKey: string) {
    const result = await this.prisma.apiKey.findFirst({
      where: {
        key: apiKey,
        activo: true,
      },
      include: { usuario: true },
    });

    console.log('result', result);

    return result;
  }
}
