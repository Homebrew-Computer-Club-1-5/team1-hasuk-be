import { Field, ObjectType, OmitType } from "@nestjs/graphql";
import { Region } from "src/db_entity/region/entities/region.entity";
import { HouseOutput } from "./fetchAllHouses_house.output";

@ObjectType()
export class fetchAllHouses extends OmitType(Region, ['houses']){
    @Field(()=>HouseOutput)
    houses : HouseOutput;
}