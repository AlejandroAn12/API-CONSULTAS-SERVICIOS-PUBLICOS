import { Controller, Post, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDTO } from '../dto/login.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TokensDto } from '../dto/tokens.dto';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { JwtRefreshGuard } from 'src/common/guards/jwt-refresh.guard';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Autenticación')
@ApiBearerAuth('jwt-auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDTO): Promise<TokensDto> {
    return this.authService.login(dto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshTokens(@Req() req: RequestWithUser): Promise<TokensDto> {
    const { sub } = req.user;
    const refreshToken = req.headers['authorization']
      ?.replace('Bearer', '')
      .trim();

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    return this.authService.refreshTokens(sub, refreshToken);
  }
}