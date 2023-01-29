import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class RestoreAcessToken extends PassportStrategy(
  Strategy,
  'restoreAccessToken',
) {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        const cookie = req.headers.cookie;
        const refreshToken = cookie.replace('refreshToken', '');
        return refreshToken;
      },
    });
  }
  async validate(payload) {
    return {
      user_auth_id: payload.user_auth_id,
      auth_method: payload.auth_method,
      name: payload.name,
    };
  }
}
