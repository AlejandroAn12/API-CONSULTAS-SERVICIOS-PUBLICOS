import { Controller, Post, Body, UseGuards, Req, UnauthorizedException, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDTO } from '../dto/login.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TokensDto } from '../dto/tokens.dto';
import { RequestWithUser } from 'src/common/types/request-with-user';
import { Public } from 'src/common/decorators/public.decorator';
import { IRegister } from '../dto/register.dto';

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

  @Public()
  @Post('register')
  async register(@Body() dto: IRegister) {
    return this.authService.register(dto);
  }


  @Post('refresh')
  async refreshTokens(@Req() req: RequestWithUser): Promise<TokensDto> {
    console.log(req)
    const { sub } = req.user;
    const refreshToken = req.headers['authorization']
      ?.replace('Bearer', '')
      .trim();

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    return this.authService.refreshTokens(sub, refreshToken);
  }

  // @Get('plans')
  // getAllPlans() {
  //   return this.planService.getAllPlans();
  // }
}