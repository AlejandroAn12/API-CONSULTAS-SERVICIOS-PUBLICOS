import { Module } from '@nestjs/common';
// import { ApiKeyGuard } from "src/common/guards/api-key.guard";
import { PrismaModule } from "src/prisma/prisma.module";
import { ApiKeyController } from "./controller/api-key.controller";
import { ApiKeyService } from "./service/api-key.service";

@Module({
    imports: [PrismaModule],
    providers: [ApiKeyService, /*ApiKeyGuard*/],
    controllers: [ApiKeyController],
    exports: [ApiKeyService, /*ApiKeyGuard*/],
})
export class ApiKeyModule {}