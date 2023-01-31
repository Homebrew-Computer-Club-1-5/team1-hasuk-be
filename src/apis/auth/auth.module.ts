import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KakaoStrategy } from 'src/common/auth/kakao.strategy';
import { RestoreAcessToken } from 'src/common/auth/restoreAccessToken.strategy';
import { User } from 'src/db_entity/user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
  providers: [
    AuthResolver,
    AuthService,
    UserService,
    KakaoStrategy,
    RestoreAcessToken,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
