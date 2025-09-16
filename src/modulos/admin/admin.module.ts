import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios/services/usuarios.service';
import { UsuariosController } from './usuarios/controllers/usuarios.controller';
import { RolesController } from './roles/controllers/roles.controller';
import { RolesService } from './roles/services/roles.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ApiKeyService } from './apiKey/apiKey.service';
import { ApiKeyController } from './apiKey/apikey.controller';
import { PlanModule } from './plan/plan.module';
import { WalletModule } from './wallet/wallet.module';
import { SettingModule } from './settings/setting.module';

@Module({

  imports: [PrismaModule, AuthModule, PlanModule, WalletModule, SettingModule],
  providers: [
    UsuariosService,
    RolesService,
    ApiKeyService
  ],
  controllers: [
    UsuariosController,
    RolesController,
    ApiKeyController
  ]
})
export class AdminModule { }
