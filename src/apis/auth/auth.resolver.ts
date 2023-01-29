import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Mutation()
  // async register() {
  //   // 1. 카카오 로그인
  //   // 2. 카카오 로그인한 데이터 받아서 DB에 저장 (회원가입)
  //   // 3. 로컬 액세스 토큰 + 리프레시 토큰 만들어서 반환
  // }
  @Query()
  async kakaoLogin() {
    // 1. 카카오 로그인
    // 2. 카카오 로그인한 데이터 받아서 DB에서 검색
    //// 1). 유저 존재하는경우 : 3단계로 바로 넘어감
    //// 2). 유저 존재하지 않는 경우 : 카카오 로그인한 데이터 DB에 저장 (회원가입)
    // 3. 로컬 aT + rT 만들어서 반환
  }

  async restoreRefreshToken() {}
}
