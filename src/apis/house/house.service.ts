import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { House } from '../../db_entity/house/entities/house.entity';
import { House_cost } from '../../db_entity/house_cost/entities/house_cost.entity';
import { House_location } from '../../db_entity/house_location/entities/house_location.entity';
import { Region } from '../../db_entity/region/entities/region.entity';
import { User } from '../../db_entity/user/entities/user.entity';
import { Icreate } from './house.type';
import { House_img } from '../../db_entity/house_img/entities/house_img.entity';
import { HttpService } from '@nestjs/axios';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class HouseService {
  constructor(
    private readonly httpService: HttpService,

    @InjectRepository(House)
    private readonly houseRepository: Repository<House>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,

    @InjectRepository(House_location)
    private readonly house_locationRepository: Repository<House_location>,

    @InjectRepository(House_cost)
    private readonly house_costRepository: Repository<House_cost>,

    @InjectRepository(House_img)
    private readonly house_imgRepository: Repository<House_img>,

    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async findAllHouses() {
    return await this.regionRepository.find({
      relations: ['houses', 'houses.house_location'],
    });
  }
  async findAllHousesByRegion({ region_id }) {
    const builder = this.houseRepository.query(
      'WITH H AS (SELECT tb_house.*, JSON_ARRAYAGG(JSON_OBJECT("img_url", tb_house_img.img_url)) AS img_urls FROM tb_house, tb_house_img WHERE tb_house.id = tb_house_img.house_id GROUP BY tb_house.id), T AS (SELECT H.*, tb_region.name AS region_name, tb_house_cost.month_cost, tb_main_spot.name AS nearest_main_spot_name, (POW(tb_main_spot_location.longitude - tb_house_location.longitude, 2) + POW(tb_main_spot_location.latitude - tb_house_location.latitude, 2)) AS mainSpotDistance FROM H, tb_house_location, tb_main_spot_location, tb_main_spot, tb_house_cost, tb_region WHERE H.region_id = ? AND H.region_id = tb_region.id AND H.house_location_id = tb_house_location.id AND tb_main_spot.main_spot_location_id = tb_main_spot_location.id AND tb_house_cost.id = H.cost_id) SELECT  T.* from T, (SELECT id, MIN(mainSpotDistance) as nd from T group by T.id) AS T2 WHERE T.mainSpotDistance = T2.nd and T.id = T2.id;',
      [region_id],
    );
    return await builder;
  }

  async findHouse({ house_id }) {
    return await this.houseRepository.findOne({
      where: { id: house_id },
      relations: [
        'house_location',
        'house_cost',
        'house_category',
        'region',
        'imgs',
      ],
    });
  }

  async create({ createHouseInput, reqUser }: Icreate) {
    console.log('게시물 등록 진행');
    const { user_auth_id, auth_method } = reqUser;
    const { house, house_location, house_cost, ...rest } = createHouseInput;
    // 1. 1:1 테이블 등록
    // 1) tb_house_location 등록
    const house_locationResult = await this.house_locationRepository.save({
      ...house_location,
    });

    // 2) tb_house_cost 등록
    const house_costResult = await this.house_costRepository.save({
      ...house_cost,
    });

    // 2. 유저 id 조회
    const userResult = await this.userRepository.findOne({
      where: { user_auth_id: user_auth_id, auth_method: auth_method },
    });

    // 3. tb_house 등록
    const houseResult = await this.houseRepository.save({
      // tb_house
      ...house,
      has_empty: 1,
      is_crolled: 0,
      board_date: Date.now(),

      // 1:1
      // tb_house_cost
      house_cost: house_costResult,
      // tb_house_location
      house_location: house_locationResult,

      // 1:N
      region: {
        id: rest.region_id,
      },
      house_category: {
        id: rest.house_category_id,
      },

      // N:M - 유저
      users: [userResult],
    });

    // 4. N:1 테이블 등록 - 이미지
    // 1) imgRawData[] => img_url[] 로 전환
    const imgRawDatas = rest.imgRawDatas;
    console.log(imgRawDatas[0]);
    const img_urls = [];
    const waitedFiles = await Promise.all(imgRawDatas);

    const storage = new Storage({
      projectId: 'board-373207',
      keyFilename: 'board-373207-a02f17b5865d.json',
    }).bucket('hasuk-storage');

    await Promise.all(
      waitedFiles.map((el) => {
        new Promise(async (resolve, reject) => {
          const time = Date.now();

          img_urls.push(
            'https://storage.cloud.google.com/hasuk-storage/' + time + '.jpg',
          );

          el.createReadStream()
            .pipe(storage.file(time + '.jpg').createWriteStream())
            .on('finish', () => {
              resolve(`hasuk-storage/${time}.jpg`);
            })
            .on('error', () => {
              reject();
            });
        });
      }),
    );

    // 2) img_url[] 를 저장

    const house_id = houseResult.id;
    const img_urlsResult = []; // [{id : 1 , img_url : "url1",house_id : 1}]
    for (let i = 0; i < img_urls.length; i++) {
      const img_url = img_urls[i];
      const img_urlResult = await this.house_imgRepository.save({
        img_url,
        house: { id: house_id },
      });
      img_urlsResult.push(img_urlResult);
    }

    // 4. 등록결과 리턴
    // return { houseResult, img_urlsResult };
    return house_id;
  }
}
