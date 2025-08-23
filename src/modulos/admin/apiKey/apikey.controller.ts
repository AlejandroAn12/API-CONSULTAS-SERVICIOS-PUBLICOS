import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiKeyService } from './apiKey.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users/:userId/api-keys')
export class ApiKeyController {
    constructor(private apiKeyService: ApiKeyService) { }

    //Listar API Keys de un usuario
    @Roles(Role.ADMINISTRADOR)
    @Get()
    async listApiKeys(@Param('userId') userId: string) {
        return this.apiKeyService.listByUser(userId);
    }

    //Revocar/Desactivar una API Key
    @Patch(':apiKeyId/revoke')
    async revokeApiKey(
        @Param('userId') userId: string,
        @Param('apiKeyId') apiKeyId: string,
    ) {
        return this.apiKeyService.revoke(Number(apiKeyId), userId);
    }
}
