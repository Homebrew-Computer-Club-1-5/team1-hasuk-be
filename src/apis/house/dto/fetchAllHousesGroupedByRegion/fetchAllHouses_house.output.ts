import { Field, ObjectType, OmitType } from "@nestjs/graphql";
import { House } from "src/db_entity/house/entities/house.entity";
import { CategoryOutput } from "./fetchAllHouses_category.output";
import { ImgOutput } from "./fetchAllHouse_house_img.output";

@ObjectType()
export class HouseOutput extends OmitType(House, ['house_category', 'region', 'imgs']){
    @Field(()=> CategoryOutput)
    house_category : CategoryOutput

    @Field(() => [ImgOutput])
    imgs: ImgOutput[];
}