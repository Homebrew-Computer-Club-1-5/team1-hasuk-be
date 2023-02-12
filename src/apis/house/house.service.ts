import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { House } from '../../db_entity/house/entities/house.entity';
import { House_cost } from '../../db_entity/house_cost/entities/house_cost.entity';
import { House_location } from '../../db_entity/house_location/entities/house_location.entity';
import { Region } from '../../db_entity/region/entities/region.entity';
import { User } from '../../db_entity/user/entities/user.entity';
import { Icreate, Iupdate } from './house.type';
import { House_img } from '../../db_entity/house_img/entities/house_img.entity';
import { HttpService } from '@nestjs/axios';
import { Storage } from '@google-cloud/storage';
import { v1 } from 'uuid';
import { Up } from 'src/db_entity/up/entities/up.entity';
import { toTimestamp } from '../crawl/functions/crawl';

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

  async findAllHousesGroupedByRegion() {
    const result = await this.regionRepository.find({
      relations: ['houses', 'houses.house_location', 'houses.house_category'],
    });
    return result;
  }

  async findAllHouses() {
    const result = await this.houseRepository.find({
      relations: ['region', 'house_cost', 'imgs', 'house_category'],
    });
    const result2 = result.map((each) => {
      each.board_date = parseInt(each.board_date as any);
      return each;
    });
    return result2;
  }

  async findAllHousesByRegion({ region_id }) {
    let builder = await this.houseRepository.query(
      "WITH H AS (SELECT tb_house.*, case JSON_ARRAYAGG(tb_house_img.img_url) WHEN '[null]' Then '[]' ELSE JSON_ARRAYAGG(tb_house_img.img_url) END AS img_urls FROM tb_house LEFT JOIN tb_house_img ON tb_house.id = tb_house_img.house_id  GROUP BY tb_house.id), T AS (SELECT H.*, tb_region.name AS region_name, tb_house_category.name AS category_name , tb_house_cost.month_cost, tb_main_spot.name AS nearest_main_spot_name, (POW(tb_main_spot_location.longitude - tb_house_location.longitude, 2) + POW(tb_main_spot_location.latitude - tb_house_location.latitude, 2)) AS mainSpotDistance FROM tb_house_location, tb_main_spot_location, tb_main_spot, tb_house_category, (H LEFT JOIN tb_house_cost ON tb_house_cost.id = H.cost_id LEFT JOIN tb_region ON H.region_id = tb_region.id) WHERE H.region_id = ? AND H.house_category_id = tb_house_category.id AND H.house_location_id = tb_house_location.id AND tb_main_spot.main_spot_location_id = tb_main_spot_location.id) SELECT  T.* from T, (SELECT id, MIN(mainSpotDistance) as nd from T group by T.id) AS T2 WHERE T.mainSpotDistance = T2.nd and T.id = T2.id;",

      [region_id],
    );
    builder.map((each) => {
      each.img_urls = JSON.parse(each.img_urls);
      return each;
    });

    return builder;
  }

  async findHouse({ house_id }) {
    const result = await this.houseRepository.findOne({
      where: { id: house_id },
      relations: [
        'house_location',
        'house_cost',
        'house_category',
        'region',
        'imgs',
      ],
    });
    if (result.is_crolled) {
      return {
        id: result.id,
        contact_number: result.contact_number,
        is_crolled: result.is_crolled,
        gender: result.gender,
        house_other_info: result.house_other_info,
        has_emtpy: result.has_empty,
        imgs: result.imgs,
        house_location: {
          latitude: 123.567,
          longitude: 123.567,
        },
        house_cost: {
          month_cost: 123,
          deposit: 123,
          other_info: '업뎃 돈정보',
        },
        house_category: {
          name: result.house_category.name,
          id: result.house_category.id,
        },
        region: {
          id: 123,
        },
      };
    } else {
      return result;
    }
  }

  async findMyHouses({ reqUser }) {
    const { user_auth_id, auth_method } = reqUser;
    // 1. reqUser로 유저 조회
    const userResult = await this.userRepository.findOne({
      where: { user_auth_id: user_auth_id, auth_method: auth_method },
    });

    // 2. tb_house_user에서 house들 모두 조회
    const house_userResult = await this.userRepository.findOne({
      where: { id: userResult.id },
      relations: ['houses'],
    });

    // 거기서 house_id들만 뽑아내기
    const house_ids = house_userResult.houses.map((house) => house.id);

    // house_id마다의 house_location_ids, house_img_ids 추출
    const house_img_ids: number[][] = [];
    const house_location_ids = [];
    for (let i = 0; i < house_ids.length; i++) {
      const house_id = house_ids[i];
      const house_Result = await this.houseRepository.findOne({
        where: { id: house_id },
        relations: ['house_location', 'imgs'],
      });
      house_location_ids.push(house_Result.house_location.id);

      const house_img_ids__: number[] = house_Result.imgs.map((img) => img.id);
      house_img_ids.push(house_img_ids__);
    }

    // 4. house_img 에서 이미지 링크"들", 기타 결과들 조회
    const house_imgResults = [];
    const house_etcResults = [];
    for (let i = 0; i < house_ids.length; i++) {
      const house_id = house_ids[i];
      const houseResult = await this.houseRepository.findOne({
        where: { id: house_id },
        relations: [
          'imgs',
          'region',
          'house_cost',
          'house_category',
          'house_location',
        ],
      });

      const img_urls = houseResult.imgs.map((house_img) => house_img.img_url);
      house_imgResults.push({
        id: house_id,
        img_urls: img_urls,
      });
      house_etcResults.push({
        id: house_id,
        region: houseResult.region.id,
        cost: {
          month_cost: houseResult.house_cost.month_cost,
          deposit: houseResult.house_cost.deposit,
          other_info: houseResult.house_cost.other_info,
        },
        house_category: houseResult.house_category.id,
        house_location: {
          latitude: houseResult.house_location.latitude,
          longitude: houseResult.house_location.longitude,
        },
      });
    }

    const lastResult = house_ids.map((house_id) => {
      const result1 = house_userResult.houses.find(
        (house) => house.id === house_id,
      );

      // const result2 = house_locationResults.find(
      //   (house_location) => house_location.id === house_id,
      // );

      const result3 = house_imgResults.find(
        (house_imgResult) => house_imgResult.id === house_id,
      );

      const result4 = house_etcResults.find((house_etcREsult) => {
        return house_etcREsult.id === house_id;
      });

      const result5 = {
        id: result1.id,
        contact_number: result1.contact_number,
        gender: result1.gender,
        house_other_info: result1.house_other_info,
        region: result4.region,
        cost: {
          month_cost: result4.cost.month_cost,
          deposit: result4.cost.deposit,
          other_info: result4.cost.other_info,
        },
        house_category: result4.house_category,
        board_date: result1.board_date,
        img_urls: result3.img_urls,
        location: {
          latitude: result4.house_location.latitude,
          longitude: result4.house_location.longitude,
        },
      };
      return result5;
    });
    return lastResult;
  }

  async deleteMyHouse({ house_id, reqUser }) {
    const { user_auth_id, auth_method } = reqUser;
    // 1. db에서 현재 인가요청 보낸 유저 조회
    const userResult = await this.userRepository.findOne({
      where: { user_auth_id: user_auth_id, auth_method: auth_method },
    });

    // 2. DB에서 house_id에 맞는 하우스 확인
    const result1 = await this.houseRepository.findOne({
      where: { id: house_id },
      relations: ['users'],
    });

    // 3. 현재 로그인된 유저가, 이 house의 주인인지 검증
    const result2 = result1.users.find((user) => {
      return user.id === userResult.id;
    });

    const isOwner = Boolean(result2);
    /// 여기에 날리는거 (db, gcp)

    // 4. 주인일시, 소프트 삭제
    if (isOwner) {
      const result3 = await this.houseRepository.softDelete({ id: house_id });

      const storage = new Storage({
        projectId: 'board-373207',
        keyFilename: 'board-373207-a02f17b5865d.json',
      }).bucket('hasuk-test-storage');

      const result4 = await this.house_imgRepository.find({
        where: { house: { id: house_id } },
        relations: ['house'],
      });

      //storage에서 삭제
      result4.map((el) => {
        const filename = el.img_url.substring(el.img_url.lastIndexOf('/') + 1);
        storage.file(filename).delete();
      });

      //db에서 삭제
      await this.house_imgRepository.delete({ house: { id: house_id } });

      return 'success';
    } else {
      return 'failed';
    }
  }

  async findHouseByLocation({ location }) {
    const locationResult = await this.house_locationRepository.findOne({
      where: { longitude: location.longitude, latitude: location.latitude },
    });
    if (locationResult === null) return null;
    const houseResult = await this.houseRepository.findOne({
      where: {
        id: locationResult.id,
      },
    });
    return houseResult.id;
  }

  async create({ createHouseInput, reqUser }: Icreate) {
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
    }).bucket('hasuk-test-storage');

    await Promise.all(
      waitedFiles.map((el) => {
        const uuid = v1();
        new Promise(async (resolve, reject) => {
          try {
            img_urls.push(
              'https://storage.googleapis.com/hasuk-test-storage/' +
                uuid +
                '.jpg',
            );

            el.createReadStream()
              .pipe(storage.file(uuid + '.jpg').createWriteStream())
              .on('finish', () => {
                resolve(`hasuk-test-storage/${uuid}.jpg`);
              })
              .on('error', () => {
                reject();
              });
          } catch (error) {
            console.log(error);
          }
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

  async update({ updateMyHouseInput }: Iupdate) {
    const { house_id, house, house_location, house_cost, ...rest } =
      updateMyHouseInput;

    // 메인 테이블에서 FK까지 전부다 조회
    const houseResult = await this.houseRepository.findOne({
      where: { id: house_id },
      relations: [
        'house_cost',
        'house_location',
        'house_category',
        'region',
        'imgs',
      ],
    });

    // tb_house_location 업뎃 (좌표)
    const result1 = await this.house_locationRepository.save({
      id: houseResult.house_location.id,
      latitude: house_location.latitude,
      longitude: house_location.longitude,
    });

    // 2. 가격 업뎃
    const result2 = await this.house_costRepository.save({
      id: houseResult.house_cost.id,
      month_cost: house_cost.month_cost,
      deposit: house_cost.deposit,
      other_info: house_cost.other_info,
    });

    // 4. house 테이블
    // 지역 업뎃
    const result3 = await this.houseRepository.save({
      id: houseResult.id,
      contact_number: house.contact_number,
      gender: house.gender,
      house_other_info: house.house_other_info,
      region: { id: rest.region_id },
      house_category: { id: rest.house_category_id },
      has_empty: 1,
      board_date: Date.now(),
    });

    // 이미지 업뎃

    const storage = new Storage({
      projectId: 'board-373207',
      keyFilename: 'board-373207-a02f17b5865d.json',
    }).bucket('hasuk-test-storage');

    const result4 = await this.house_imgRepository.find({
      where: { house: { id: house_id } },
      relations: ['house'],
    });

    //storage에서 삭제
    result4.map((el) => {
      const filename = el.img_url.substring(el.img_url.lastIndexOf('/') + 1);
      storage.file(filename).delete();
    });
    //db에서 삭제
    await this.house_imgRepository.delete({ house: { id: house_id } });

    //새로운 이미지파일로 업데이트
    const imgRawDatas = rest.imgRawDatas;
    const img_urls = [];
    const waitedFiles = await Promise.all(imgRawDatas);

    await Promise.all(
      waitedFiles.map((el) => {
        const uuid = v1();
        new Promise(async (resolve, reject) => {
          try {
            img_urls.push(
              'https://storage.googleapis.com/hasuk-test-storage/' +
                uuid +
                '.jpg',
            );

            el.createReadStream()
              .pipe(storage.file(uuid + '.jpg').createWriteStream())
              .on('finish', () => {
                resolve(`hasuk-test-storage/${uuid}.jpg`);
              })
              .on('error', () => {
                reject();
              });
          } catch (error) {
            console.log(error);
          }
        });
      }),
    );

    // 2) img_url[] 를 저장

    const img_urlsResult = []; // [{id : 1 , img_url : "url1",house_id : 1}]
    for (let i = 0; i < img_urls.length; i++) {
      const img_url = img_urls[i];
      const img_urlResult = await this.house_imgRepository.save({
        img_url,
        house: { id: house_id },
      });
      img_urlsResult.push(img_urlResult);
    }

    return result3.id;
  }

  async findAllCrawledHouses() {
    const result = await this.houseRepository.find({
      where: { is_crolled: 1 },
      relations: ['imgs', 'house_category'],
    });
    const result2 = result.map((house, index) => {
      const aaa = result[index].imgs.map((house_img) => house_img.img_url);
      const category = house.house_category.id;
      return {
        id: house.id,
        img_urls: aaa,
        house_category: category,
      };
    });

    return result2;
  }
}
