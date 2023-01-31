import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_REST_API_KEY,
      callbackURL: process.env.KAKAO_REDIRECT_URI,
    });
  }
  async validate(accessToken, refreshToken, profile) {
    const {
      username,
      _json: {
        kakao_account: { email },
      },
    } = profile;
    console.log('스트레트지');
    return {
      auth_method: 1,
      name: username,
      user_auth_id: email,
    };
  }
}
