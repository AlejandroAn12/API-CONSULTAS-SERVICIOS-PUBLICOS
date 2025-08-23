import { Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiKeyService } from "../service/api-key.service";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role.enum";
import { Public } from "src/common/decorators/public.decorator";

@UseGuards(JwtAuthGuard)
@Controller("api-key")
export class ApiKeyController {
    constructor(private readonly apiKeyService: ApiKeyService) { }

    // solo usuarios autenticados pueden generar
     @Public()
    @Roles(Role.ADMINISTRADOR)
    @Post('generar-api-key')
    async generarApiKey(@Req() req) {
        return this.apiKeyService.generateApiKey(req.user.sub);
    }
}
