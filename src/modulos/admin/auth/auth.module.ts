import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './controller/auth.controller';
import { JwtRefreshStrategy } from './strategies/refreshToken.strategy';
import { UsuariosService } from '../usuarios/services/usuarios.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PlanService } from '../plan/plan.service';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') },
      }),
    }),
    PrismaModule

  ],
  providers: [ AuthService, UsuariosService, PlanService, JwtStrategy, JwtRefreshStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
