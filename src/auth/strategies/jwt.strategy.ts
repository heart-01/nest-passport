import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IPayloadJWT } from '../../interface/IPayloadJWT';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let jwt = null;
          if (request && request.cookies) {
            jwt = request.cookies['access_token'];
          }
          return jwt || null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),

      secretOrKey: configService.get('JWT_SECRET'), // Use the secret from environment variables
      ignoreExpiration: false,
    });
  }

  async validate(payload: IPayloadJWT) {
    // This payload will be the decrypted token payload you provided when signing the token
    return { userId: payload.sub, email: payload.email };
  }
}
