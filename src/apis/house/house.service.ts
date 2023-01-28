import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { House } from '../db_entity_crud/house/entities/house.entity';
import { Main_spot } from '../db_entity_crud/main_spot/entities/main_spot.entity';
import { Region } from '../db_entity_crud/region/entities/region.entity';
import { User } from '../db_entity_crud/user/entities/user.entity';
import { Icreate } from './house.type';

@Injectable()
export class HouseService {
  constructor(
    @InjectRepository(House)
    private readonly house_repository: Repository<House>,

    @InjectRepository(User)
    private readonly user_repository: Repository<User>,

    @InjectRepository(Main_spot)
    private readonly main_spot_repository: Repository<Main_spot>,

    @InjectRepository(Region)
    private readonly region_repository: Repository<Region>,
  ) {}

  async findAllHouses() {
    return await this.region_repository.find({
      relations: ['houses', 'houses.house_location'],
    });
  }
  async findAllHousesByRegion({ region_id }) {
    const builder = this.house_repository.query(
      'WITH H AS (SELECT tb_house.*, JSON_ARRAYAGG(JSON_OBJECT("img_url", tb_house_img.img_url)) AS img_urls FROM tb_house, tb_house_img WHERE tb_house.id = tb_house_img.house_id GROUP BY tb_house.id), T AS (SELECT H.*, tb_region.name AS region_name, tb_cost.month_cost, tb_main_spot.name AS nearest_main_spot_name, (POW(tb_main_spot_location.longitude - tb_house_location.longitude, 2) + POW(tb_main_spot_location.latitude - tb_house_location.latitude, 2)) AS mainSpotDistance FROM H, tb_house_location, tb_main_spot_location, tb_main_spot, tb_cost, tb_region WHERE H.region_id = ? AND H.region_id = tb_region.id AND H.house_location_id = tb_house_location.id AND tb_main_spot.main_spot_location_id = tb_main_spot_location.id AND tb_cost.id = H.cost_id) SELECT  T.* from T, (SELECT id, MIN(mainSpotDistance) as nd from T group by T.id) AS T2 WHERE T.mainSpotDistance = T2.nd and T.id = T2.id;',
      [region_id],
    );
    return await builder;
  }

  async findHouse({ house_id }) {
    return await this.house_repository.findOne({
      where: { id: house_id },
      relations: ['house_location', 'cost', 'house_category', 'region', 'imgs'],
    });
  }

  async create({ houseData, user_auth_id, auth_method }: Icreate) {
    console.log(houseData, user_auth_id);
    console.log(Date.now());
    // const result = await this.house_repository.save({
    //   contact_number : houseData.contact_number,
    //   gender : houseData.gender,
    //   house_other_info : houseData.house_other_info,
    //   has_empty : 1,
    //   is_crolled : 0,
    //   board_date : Date.now(),

    // })
    // 2. tb_user에서 id 검색 해오기
    const user_id = await this.user_repository.findOne({
      where: { user_auth_id: user_auth_id, auth_method: auth_method },
    });

    // 3. tb_house_usr에 등록

    // 4. 등록결과 리턴
    return '하위';
  }
}
