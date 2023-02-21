import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { House } from '../../db_entity/house/entities/house.entity';
import { Region } from '../../db_entity/region/entities/region.entity';
import { fetchHousesByRegionOutput } from './dto/fetchHousesByRegion/fetchHousesByRegion.output';
import { HouseService } from './house.service';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { ReqUser } from 'src/common/auth/gql-auth.param';
import { IreqUser } from './house.type';
import { CreateHouseInput } from './dto/createHouse/createHouse.input';
import { House_locationInput } from './dto/createHouse/createHouse.house_location.input';
import { House_location } from 'src/db_entity/house_location/entities/house_location.entity';
import { FetchMyHouseOutput } from './dto/fetchMyHouse/fetchMyHouse.output';
import { UpdateMyHouseInput } from './dto/updateMyHouse/updateMyHouse.input';
import { FetchCrawledHousesOutput } from './dto/fetchCrawledHouses/fetchCrawledHouses.output';
import { House_img } from 'src/db_entity/house_img/entities/house_img.entity';
import { FetchHouseOutput } from './dto/fetchHouse/fetchHouse.output';
import { fetchAllHousesOutput } from './dto/fetchAllHouses/fetchAllHouses.output';
import { FetchUpOutput } from './dto/fetchUp/fetchUp.output';
import { fetchHousesByRegionLoginedOutput } from './dto/fetchHousesByRegionLogined/fetchHousesByRegionLogined.output';
import { FetchMyWishHousesOutput } from './dto/fetchMyWishHouses/fetchMyWishHouses.output';
import { FetchHouseLoginedOutput } from './dto/fetchHouseLogined/fetchHouseLogined.output';

@Resolver()
export class HouseResolver {
  constructor(private readonly houseService: HouseService) {}

  //모든부근의 모든 집 정보를 가져오기
  @Query(() => [fetchAllHousesOutput])
  fetchAllHousesGroupedByRegion() {
    return this.houseService.findAllHousesGroupedByRegion();
  }

  //특정부근의 집+가장가까운 주요지점 정보 가져오기
  @Query(() => [fetchHousesByRegionOutput])
  fetchHousesByRegion(@Args('region_id') region_id: number) {
    return this.houseService.findAllHousesByRegion({ region_id });
  }

  //로그인한 유저에게 특정부근의 집+가장가까운 주요지점 정보 가져오기
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [fetchHousesByRegionLoginedOutput])
  fetchHousesByRegionLogined(
    @ReqUser() reqUser: IreqUser,
    @Args('region_id') region_id: number) {
    return this.houseService.findAllHousesByRegion({ region_id, reqUser });
  }

  //특정 집 정보 가져오기
  @Query(() => FetchHouseOutput)
  fetchHouse(@Args('house_id') house_id: number) {
    return this.houseService.findHouse({ house_id });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => FetchHouseLoginedOutput)
  fetchHouseLogined(
    @Args('house_id') house_id: number,
    @ReqUser() reqUser: IreqUser
    ) {
    return this.houseService.findHouse({ house_id, reqUser });
  }

  @Query(() => [House])
  async fetchAllHouses() {
    return this.houseService.findAllHouses();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async createHouse(
    @Args('createHouseInput') createHouseInput: CreateHouseInput,
    @ReqUser() reqUser: IreqUser,
  ) {
    console.log('유저 인가 완료', reqUser);
    // 1. 등록!!
    const result2 = await this.houseService.create({
      createHouseInput,
      reqUser,
    });
    return result2;
  }

  @Query(() => Number) // house_id 를 리턴
  async fetchHouseByLocation(@Args('location') location: House_locationInput) {
    return await this.houseService.findHouseByLocation({ location });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [FetchMyHouseOutput])
  async fetchMyHouse(@ReqUser() reqUser: IreqUser) {
    return await this.houseService.findMyHouses({ reqUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [FetchMyWishHousesOutput])
  async fetchMyWishHouses(@ReqUser() reqUser: IreqUser) {
    return await this.houseService.findMyWishHouses({ reqUser });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async deleteMyHouse(
    @ReqUser() reqUser: IreqUser,
    @Args('house_id') house_id: number,
  ) {
    const result = await this.houseService.deleteMyHouse({ house_id, reqUser });
    return result;
  }

  @Mutation(() => Int)
  async updateMyHouse(
    @Args('updateMyHouseInput') updateMyHouseInput: UpdateMyHouseInput,
  ) {
    const result2 = await this.houseService.update({
      updateMyHouseInput,
    });
    return result2;
  }

  @Query(() => [FetchCrawledHousesOutput])
  async fetchCrawledHouses() {
    return await this.houseService.findAllCrawledHouses();
  }
}
