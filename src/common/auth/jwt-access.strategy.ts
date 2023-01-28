import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwtAccessStrategy',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'jwtAccessStrategyKey',
    });
  }

  validate(payload) {
    console.log(payload);
    return {
      user_auth_id: payload.user_auth_id,
      name: payload.name,
    };
  }
}
