import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SettingService } from './setting.service';
import { CreateSettingDto } from './dto/create.setting.dto';
import { UpdateSettingDto } from './dto/update.setting.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('settings')
export class SettingController {
    constructor(private readonly settingService: SettingService) { }

    @Post()
    create(@Body() dto: CreateSettingDto) {
        return this.settingService.create(dto);
    }

    @Get()
    findAll() {
        return this.settingService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.settingService.findOne(Number(id));
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateSettingDto) {
        return this.settingService.update(Number(id), dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.settingService.remove(Number(id));
    }
}
