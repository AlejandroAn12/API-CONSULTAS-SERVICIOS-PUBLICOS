import { Controller, Get, Param, Patch, UseGuards, Post, Body, Req } from '@nestjs/common';
import { ApiKeyService } from './apiKey.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

// @Controller('keys/:userId/api-keys')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('apikeys')
export class ApiKeyController {
    constructor(private apiKeyService: ApiKeyService) { }

    //Crear una nueva API Key
    @Roles(Role.ADMINISTRADOR)
    @Post('create/user/:userId')
    async createApiKey(
        @Param('userId') userId: string,
        @Body() body: { system: string; durationDays: number },
    ) {
        return this.apiKeyService.create(userId, body.system, body.durationDays);
    }

    //Listar API Keys de un usuario
    // @Roles(Role.ADMINISTRADOR)
    @Get('list/:userId')
    async listApiKeys(@Param('userId') userId: string) {
        console.log('Usuario', userId);
        return this.apiKeyService.listByUser(userId);
    }


    //Obtener la key de un usuario logeado
    @Get('user/key')
    getApiKeyUser(@Req() req) {
        const userId = req.user.sub;
        return this.apiKeyService.getKeyActive(userId)
    }

    //Revocar API Key
    @Roles(Role.ADMINISTRADOR)
    @Patch('users/:userId/apikeys/:apiKeyId/revoke')
    async revokeApiKey(
        @Param('userId') userId: string,
        @Param('apiKeyId') apiKeyId: string,
    ) {
        return this.apiKeyService.revoke(Number(apiKeyId), userId);
    }

    //Renovar API Key (extender vigencia)
    @Roles(Role.ADMINISTRADOR)
    @Patch('users/:userId/apikeys/:apiKeyId/renew')
    async renewApiKey(
        @Param('userId') userId: string,
        @Param('apiKeyId') apiKeyId: string,
        @Body() body: { days: number },
    ) {
        return this.apiKeyService.renew(Number(apiKeyId), userId, body.days);
    }
}
