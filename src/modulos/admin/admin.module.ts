import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios/services/usuarios.service';
import { UsuariosController } from './usuarios/controllers/usuarios.controller';
import { RolesController } from './roles/controllers/roles.controller';
import { RolesService } from './roles/services/roles.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RolesPermisosController } from './roles/controllers/roles-permisos.controller';
import { RolesPermisosService } from './roles/services/rolesPermisosService.service';
import { AuthModule } from './auth/auth.module';
import { ApiKeyService } from './apiKey/apiKey.service';
import { ApiKeyController } from './apiKey/apikey.controller';
import { PlanModule } from './plan/plan.module';

@Module({
  imports: [PrismaModule, AuthModule, PlanModule],
  providers: [
    UsuariosService,
    RolesService,
    RolesPermisosService,
    ApiKeyService
  ],
  controllers: [
    UsuariosController,
    RolesController,
    RolesPermisosController,
    ApiKeyController
  ]
})
export class AdminModule { }
