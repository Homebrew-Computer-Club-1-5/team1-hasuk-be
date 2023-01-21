import { Field, Int, ObjectType, OmitType } from "@nestjs/graphql";
import { House } from "src/apis/db_entity_crud/house/entities/house.entity";
import { ImgurlOutput } from "./imgUrl.output";


@ObjectType()
export class fetchAllHousesOutput extends OmitType(House, ["cost", "house_location", "house_category", "region", "imgs"]){
    @Field(()=>Int)
    month_cost : number;

    @Field(()=>[ImgurlOutput])
    img_urls : JSON;

    @Field(()=>String)
    nearest_main_spot_name : string;

    @Field(()=>String)
    region_name : string;
    
}