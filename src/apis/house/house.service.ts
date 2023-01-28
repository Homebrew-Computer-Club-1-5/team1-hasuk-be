import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { House } from '../db_entity_crud/house/entities/house.entity';
import { Main_spot } from '../db_entity_crud/main_spot/entities/main_spot.entity';
import { Region } from '../db_entity_crud/region/entities/region.entity';
import { Icreate } from './house.type';

@Injectable()
export class HouseService {
  constructor(
    @InjectRepository(House)
    private readonly house_repository: Repository<House>,

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

  async create({ houseData, user_auth_id }: Icreate) {}
}
