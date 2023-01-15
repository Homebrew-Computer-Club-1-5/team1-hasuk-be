import { Args, Query, Resolver } from "@nestjs/graphql";
import { House } from "../db_entity_crud/house/entities/house.entity";
import { Region } from "../db_entity_crud/region/entities/region.entity";
import { fetchAllHousesOutput } from "./dto/fetchAllHouses.output";
import { HouseService } from "./house.service";

@Resolver()
export class HouseResolver{
    constructor(private readonly houseService: HouseService){}

    //모든부근의 모든 집 정보를 가져오기
    @Query(() => [Region])
    fetchAllHouses(){
        return this.houseService.findAllHouses();
    }

    //특정부근의 집+가장가까운 주요지점 정보 가져오기
    @Query(()=> [fetchAllHousesOutput])
    fetchHousesByRegion(
        @Args('region_id') region_id: number,
    ){
        console.log("dsgsgsg");
        return this.houseService.findAllHousesByRegion({region_id});
    }

    //특정 집 정보 가져오기
    @Query(()=> House)
    fetchHouse(
        @Args('house_id') house_id: number,
    ){
        return this.houseService.findHouse({house_id});
    }

}