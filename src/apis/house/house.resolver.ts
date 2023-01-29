import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Any } from 'typeorm';
import { House } from '../../db_entity/house/entities/house.entity';
import { Region } from '../../db_entity/region/entities/region.entity';
import { fetchAllHousesOutput } from './dto/fetchAllHouses.output';
import { HouseService } from './house.service';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { ReqUser } from 'src/common/auth/gql-auth.param';
import { IreqUser } from './house.type';
import { CreateHouseInput } from './dto/createHouse/createHouse.input';

@Resolver()
export class HouseResolver {
  constructor(private readonly houseService: HouseService) {}

  //모든부근의 모든 집 정보를 가져오기
  @Query(() => [Region])
  fetchAllHouses() {
    return this.houseService.findAllHouses();
  }

  //특정부근의 집+가장가까운 주요지점 정보 가져오기
  @Query(() => [fetchAllHousesOutput])
  fetchHousesByRegion(@Args('region_id') region_id: number) {
    return this.houseService.findAllHousesByRegion({ region_id });
  }

  //특정 집 정보 가져오기
  @Query(() => House)
  fetchHouse(@Args('house_id') house_id: number) {
    return this.houseService.findHouse({ house_id });
  }

  // @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async createHouse(
    @Args('createHouseInput') createHouseInput: CreateHouseInput,
    // @ReqUser() reqUser: IreqUser,
  ) {
    // const obj = {
    //   contact_number: '010-1234-5678',
    //   university_id: 3,
    //   region_id: 2,
    //   house_location: {
    //     latitude: 1234,
    //     longitude: 4321,
    //   },
    //   month_cost: 30,
    //   deposit: 500,
    //   cost_other_info: '공과금 없음',
    //   gender: '0',
    //   house_category_id: 1,
    //   house_other_info: '채광 잘됨.',
    // };
    const reqUser = {
      user_auth_id: 'gunpoll823@gmail.com',
      name: '김건',
      auth_method: 1,
    };
    // 1. 등록!!
    return await this.houseService.create({
      createHouseInput,
      reqUser,
    });
  }
}
