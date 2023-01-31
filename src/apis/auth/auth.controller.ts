import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from 'src/db_entity/user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

interface IOauthUser {
  user: Pick<User, 'auth_method' | 'name' | 'user_auth_id'>;
}

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // async register() {
  //   // 1. 카카오 로그인
  //   // 2. 카카오 로그인한 데이터 받아서 DB에 저장 (회원가입)
  //   // 3. 로컬 액세스 토큰 + 리프레시 토큰 만들어서 반환
  // }
  @Get('/auth/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin(
    @Req() req: Request & IOauthUser, //
    @Res() res: Response,
  ) {
    // 1. 카카오 로그인
    const { user_auth_id, name, auth_method } = req.user;
    // 2. 카카오 로그인한 데이터 받아서 DB에서 검색
    const findOneUserResult = await this.userService.findOne({
      user_auth_id,
      name,
      auth_method,
    });
    //// 1). 유저 존재하는경우 : 3단계로 바로 넘어감
    if (findOneUserResult)
      console.log(`기 가입된 ${findOneUserResult.name}유저 로그인`);
    //// 2). 유저 존재하지 않는 경우 : 카카오 로그인한 데이터 DB에 저장 (회원가입)
    if (!findOneUserResult) {
      const createUserResult = await this.userService.create({
        user_auth_id,
        name,
        auth_method,
      });
      if (createUserResult) {
        console.log(`${createUserResult.name}유저 회원가입 완료`);
      } else {
        console.log('등록 실패');
      }
    }
    // 3. 로컬 aT + rT 만들어서 반환
    const makeTokensResult = await this.authService.makeTokens(
      {
        user_auth_id,
        auth_method,
      },
      res,
    );

    res.redirect(
      `${process.env.CLIENT_URL}/main?accessToken=${makeTokensResult.accessToken}`,
    );
  }

  @Get('/auth/restore-access-token')
  @UseGuards(AuthGuard('restoreAccessToken'))
  async restoreAccessToken(
    @Req() req: Request & IOauthUser, //
    @Res() res: Response,
  ) {
    console.log('restore 성공~');
    const { auth_method, user_auth_id } = req.user;
    //1. 리프레시 토큰 받아서 2주 지났는지 확인

    //2. 2주 지났으면 => "장기간 로그아웃으로 재 로그인이 필요합니다." 에러메세지 + 로그인 화면으로 리다렉션

    //3. 안지났으면 => 액세스 토큰 재발급해서 리턴
    const restoreAccesTokenResult = await this.authService.makeTokens(
      { auth_method, user_auth_id },
      undefined,
    );

    res.send(restoreAccesTokenResult.accessToken);
  }
}
