import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { House } from '../../db_entity/house/entities/house.entity';
import { Region } from '../../db_entity/region/entities/region.entity';
import { fetchAllHousesOutput } from './dto/fetchAllHouses.output';
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
  @Mutation(() => String)
  async createHouse(
    @Args('createHouseInput') createHouseInput: CreateHouseInput,
    @ReqUser() reqUser: IreqUser,
    // @GqlRes() res: Response,
  ) {
    console.log('유저 인가 완료', reqUser);
    // 1. 등록!!
    const result2 = await this.houseService.create({
      createHouseInput,
      reqUser,
    });
    console.log(result2);
    return result2;
  }

  @Query(() => House_location)
  async fetchHouseByLocation(@Args('location') location: House_locationInput) {
    return await this.houseService.findHouseByLocation({ location });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [FetchMyHouseOutput])
  async fetchMyHouse(@ReqUser() reqUser: IreqUser) {
    console.log(1);
    return await this.houseService.findMyHouses({ reqUser });
  }

  // @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async deleteMyHouse(
    // @ReqUser() reqUser: IreqUser,
    @Args('house_id') house_id: number,
  ) {
    const reqUser: IreqUser = {
      user_auth_id: 'gunpol@naver.com',
      name: '김건',
      auth_method: 1,
    };
    const result = await this.houseService.deleteMyHouse({ house_id, reqUser });
    return result;
  }

  // @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Int)
  async updateMyHouse(
    @Args('updateMyHouseInput') updateMyHouseInput: UpdateMyHouseInput,
    // @ReqUser() reqUser: IreqUser,
  ) {
    // 1. 등록!!
    const reqUser: IreqUser = {
      user_auth_id: 'gunpol@naver.com',
      name: '김건',
      auth_method: 1,
    };
    const result2 = await this.houseService.update({
      updateMyHouseInput,
      reqUser,
    });
    return result2;
  }

  @Query(() => [FetchCrawledHousesOutput])
  async fetchCrawledHouses() {
    return await this.houseService.findAllCrawledHouses();
  }
}
