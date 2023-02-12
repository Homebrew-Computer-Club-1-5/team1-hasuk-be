import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/common/auth/jwt-access.strategy';
import { House } from 'src/db_entity/house/entities/house.entity';
import { Up } from 'src/db_entity/up/entities/up.entity';
import { User } from 'src/db_entity/user/entities/user.entity';
import { UpResolver } from './up.resolver';
import { UpService } from './up.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Up, House]), JwtAccessStrategy],
  providers: [UpResolver, UpService],
})
export class UpModule {}
