import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from 'src/common/auth/jwt-access.strategy';
import { House_cost } from '../db_entity_crud/house_cost/entities/house_cost.entity';
import { House } from '../db_entity_crud/house/entities/house.entity';
import { House_category } from '../db_entity_crud/house_category/entities/house_category.entity';
import { House_img } from '../db_entity_crud/house_img/entities/house_img.entity';
import { Main_spot } from '../db_entity_crud/main_spot/entities/main_spot.entity';
import { Region } from '../db_entity_crud/region/entities/region.entity';
import { User } from '../db_entity_crud/user/entities/user.entity';
import { HouseResolver } from './house.resolver';
import { HouseService } from './house.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      House,
      Main_spot,
      Region,
      House_cost,
      House_category,
      House_img,
      User,
    ]),
    JwtAccessStrategy,
  ],
  providers: [HouseResolver, HouseService],
})
export class HouseModule {}
