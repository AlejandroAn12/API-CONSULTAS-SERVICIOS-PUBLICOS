import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
      passReqToCallback: false,
    });
  }

  async validate(payload: any) {
    return {
      sub: payload.sub,
      email: payload.email,
    };
  }
}
// export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         (req) => {
//           let token = null;
//           if (req?.cookies) {
//             token = req.cookies['refresh_token'];
//           }
//           return token;
//         },
//       ]),
//       secretOrKey: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
//     });
//   }

//   async validate(payload: any) {
//     return payload;
//   }
// }
