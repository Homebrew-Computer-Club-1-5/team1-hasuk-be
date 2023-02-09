import { Field, ObjectType, OmitType } from "@nestjs/graphql";
import { Main_spot } from "src/db_entity/main_spot/entities/main_spot.entity";
import { Main_spot_locationOutput } from "./fetchMainSpots.main_spot_location.output";
@ObjectType()
export class FetchMainSpotsOutput extends OmitType(Main_spot, ['main_spot_location']){
    @Field(()=>Main_spot_locationOutput)
    main_spot_location : Main_spot_locationOutput;
}