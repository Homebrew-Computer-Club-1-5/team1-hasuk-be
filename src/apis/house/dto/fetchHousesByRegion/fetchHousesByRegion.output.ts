import { Field, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { House } from 'src/db_entity/house/entities/house.entity';
import { House_category } from 'src/db_entity/house_category/entities/house_category.entity';
import { ImgurlOutput } from '../imgUrl.output';

@ObjectType()
export class fetchHousesByRegionOutput extends OmitType(House, [
  'house_cost',
  'house_location',
  'region',
  'imgs',
]) {
  @Field(() => Int, { nullable: true })
  month_cost: number;

  @Field(() => [String])
  img_urls: string[];

  @Field(() => String)
  nearest_main_spot_name: string;

  @Field(() => String)
  region_name: string;

  @Field(() => Int)
  house_category_id: number;
}
