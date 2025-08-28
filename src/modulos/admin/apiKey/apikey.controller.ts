import { Controller, Get, Param, Patch, UseGuards, Post, Body } from '@nestjs/common';
import { ApiKeyService } from './apiKey.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users/:userId/api-keys')
export class ApiKeyController {
    constructor(private apiKeyService: ApiKeyService) { }

    //Crear una nueva API Key
    @Roles(Role.ADMINISTRADOR)
    @Post()
    async createApiKey(
        @Param('userId') userId: string,
        @Body() body: { system: string; durationDays: number },
    ) {
        return this.apiKeyService.create(userId, body.system, body.durationDays);
    }

    //Listar API Keys de un usuario
    @Roles(Role.ADMINISTRADOR)
    @Get()
    async listApiKeys(@Param('userId') userId: string) {
        return this.apiKeyService.listByUser(userId);
    }

    //Revocar API Key
    @Roles(Role.ADMINISTRADOR)
    @Patch(':apiKeyId/revoke')
    async revokeApiKey(
        @Param('userId') userId: string,
        @Param('apiKeyId') apiKeyId: string,
    ) {
        return this.apiKeyService.revoke(Number(apiKeyId), userId);
    }

    //Renovar API Key (extender vigencia)
    @Roles(Role.ADMINISTRADOR)
    @Patch(':apiKeyId/renew')
    async renewApiKey(
        @Param('userId') userId: string,
        @Param('apiKeyId') apiKeyId: string,
        @Body() body: { days: number },
    ) {
        return this.apiKeyService.renew(Number(apiKeyId), userId, body.days);
    }

    // //Listar API Keys de un usuario
    // @Roles(Role.ADMINISTRADOR)
    // @Get()
    // async listApiKeys(@Param('userId') userId: string) {
    //     return this.apiKeyService.listByUser(userId);
    // }

    // //Revocar/Desactivar una API Key
    // @Patch(':apiKeyId/revoke')
    // async revokeApiKey(
    //     @Param('userId') userId: string,
    //     @Param('apiKeyId') apiKeyId: string,
    // ) {
    //     return this.apiKeyService.revoke(Number(apiKeyId), userId);
    // }
}
