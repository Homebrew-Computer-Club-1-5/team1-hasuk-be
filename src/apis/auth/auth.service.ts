import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db_entity/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async makeTokens({ user_auth_id, auth_method }, res: Response | undefined) {
    // 리프레시 토큰 만들고, 헤더 셋팅
    console.log(1);
    const refreshToken = this.jwtService.sign(
      { user_auth_id, auth_method },
      { secret: 'jwtRefreshStrategyKey', expiresIn: '2w' },
    );
    if (res) {
      // res.setHeader('Access-Control-Allow-Origin', `http://localhost:3000`);
      // res.setHeader('Access-Control-Allow-Credentials', `true`);
      res.setHeader(
        'Set-Cookie',
        `refreshToken=${refreshToken}; path=/; domain:localhost;`,
      );
    }

    // 액세스 토큰 만들어서
    const accessToken = this.jwtService.sign(
      { user_auth_id, auth_method },
      { secret: 'jwtAccessStrategyKey', expiresIn: '10s' },
    );
    console.log(accessToken);
    return { accessToken };
  }

  async kakaoOauth() {}

  async findUser() {}

  async createUser() {}
}
