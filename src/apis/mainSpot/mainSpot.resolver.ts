import { Query, Resolver } from "@nestjs/graphql";
import { Main_spot } from "../db_entity_crud/main_spot/entities/main_spot.entity";
import { MainSpotService } from "./mainSpot.service";


@Resolver()
export class MainSpotResolver{
    constructor(private readonly mainService: MainSpotService){}


    //모든 주요지점 가져오기
    @Query(() => [Main_spot])
    fetchMainSpots(){
        return this.mainService.findAllMainSpot();
    }

}