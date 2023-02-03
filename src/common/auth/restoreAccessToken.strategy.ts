import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

function getRefreshTokenFromCookies(cookie: any) {
  const cookieArray = cookie.split(';');
  const refreshToken = cookieArray.find((item) =>
    item.trim().startsWith('refreshToken='),
  );
  return refreshToken ? refreshToken.split('=')[1] : null;
}

export class RestoreAcessToken extends PassportStrategy(
  Strategy,
  'restoreAccessToken',
) {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        const cookie = req.headers.cookie;
        console.log(cookie);
        const refreshToken = getRefreshTokenFromCookies(cookie);
        return refreshToken;
      },
      secretOrKey: 'jwtRefreshStrategyKey',
    });
  }

  validate(payload) {
    console.log(payload);
    return {
      user_auth_id: payload.user_auth_id,
      auth_method: payload.auth_method,
      name: payload.name,
    };
  }
}
