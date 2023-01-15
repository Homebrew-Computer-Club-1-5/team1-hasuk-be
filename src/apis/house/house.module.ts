import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cost } from "../db_entity_crud/cost/entities/cost.entity";
import { House } from "../db_entity_crud/house/entities/house.entity";
import { House_category } from "../db_entity_crud/house_category/entities/house_category.entity";
import { House_img } from "../db_entity_crud/house_img/entities/house_img.entity";
import { Main_spot } from "../db_entity_crud/main_spot/entities/main_spot.entity";
import { Region } from "../db_entity_crud/region/entities/region.entity";
import { HouseResolver } from "./house.resolver";
import { HouseService } from "./house.service";


@Module({
    imports: [TypeOrmModule.forFeature([House, Main_spot, Region, Cost, House_category, House_img])],
    providers: [HouseResolver,HouseService],
})
export class HouseModule{}