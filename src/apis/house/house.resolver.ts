import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Any } from 'typeorm';
import { House } from '../db_entity_crud/house/entities/house.entity';
import { Region } from '../db_entity_crud/region/entities/region.entity';
import { fetchAllHousesOutput } from './dto/fetchAllHouses.output';
import { HouseService } from './house.service';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { ReqUser } from 'src/common/auth/gql-auth.param';
import { IhouseData, IreqUser } from './house.type';

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

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Any)
  async createHouse(
    @Args('houseData') houseData: IhouseData,
    @ReqUser() reqUser: IreqUser,
  ) {
    // 1. 등록!!
    this.houseService.create({
      houseData: houseData,
      user_auth_id: reqUser.user_auth_id,
    });

    console.log(reqUser);
  }
}
