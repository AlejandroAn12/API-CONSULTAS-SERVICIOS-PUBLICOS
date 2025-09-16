import { Injectable, NotFoundException } from '@nestjs/common';


import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSettingDto } from './dto/create.setting.dto';
import { UpdateSettingDto } from './dto/update.setting.dto';

@Injectable()
export class SettingService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateSettingDto) {
    return this.prisma.setting.create({ data: dto });
  }

  async findAll() {
    return this.prisma.setting.findMany();
  }

  async findOne(id: number) {
    const setting = await this.prisma.setting.findUnique({ where: { id } });
    if (!setting) {
      throw new NotFoundException('Configuración no encontrada');
    }
    return setting;
  }

  async update(id: number, dto: UpdateSettingDto) {
    return this.prisma.setting.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.setting.delete({ where: { id } });
  }

  async findByKey(key: string) {
    return this.prisma.setting.findUnique({ where: { key } });
  }
}
