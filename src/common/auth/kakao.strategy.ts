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
        kakao_account: { email, has_age_range, age_range },
      },
    } = profile;
    return {
      auth_method: 1,
      name: profile.username,
      user_auth_id: email,
      age_range: age_range ? age_range : '없음',
    };
  }
}
