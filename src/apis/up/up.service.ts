import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { House } from 'src/db_entity/house/entities/house.entity';
import { Up } from 'src/db_entity/up/entities/up.entity';
import { User } from 'src/db_entity/user/entities/user.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { toTimestamp } from '../crawl/koreaPas/util';

@Injectable()
export class UpService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Up)
    private readonly upRepository: Repository<Up>,

    @InjectRepository(House)
    private readonly houseRepository: Repository<House>,
  ) {}

  async upHouse({ house_id, reqUser }) {
    const { user_auth_id, auth_method } = reqUser;
    // 1. reqUser로 유저 조회
    const userResult = await this.userRepository.findOne({
      where: { user_auth_id: user_auth_id, auth_method: auth_method },
    });

    // 2. UP 테이블에 user_id, house_id 모두 일치하는거 있는지 확인 => 있으면 빠꾸, 없으면 row 생성
    const upFindResult = await this.upRepository.findOne({
      where: { house_id, user_id: userResult.id },
    });

    if (upFindResult) return upFindResult;
    const upCreateResult = await this.upRepository.save({
      user_id: userResult.id,
      house_id: house_id,
    });

    const board_date = toTimestamp(upCreateResult.created_at as any);
    // 3. 1번에서 생긴 created_at 값 과 house_id 값으로 tb_house 업데이트
    const houseResult = await this.houseRepository.save({
      id: house_id,
      board_date,
    });

    // 4. 결과 조인해서 반환
    return houseResult;
  }

  @Cron(`0 0 0 */3 * *`, {
    name: 'a',
    timeZone: 'Asia/Seoul',
  })
  async refreshUp() {
    // 3 일 마다 UP DB refresh
    const currentTime = new Date();
    const threeDaysAgo = new Date(
      currentTime.getTime() - 3 * 24 * 60 * 60 * 1000,
    );
    await this.upRepository.delete({ created_at: LessThan(threeDaysAgo) });
  }
}
