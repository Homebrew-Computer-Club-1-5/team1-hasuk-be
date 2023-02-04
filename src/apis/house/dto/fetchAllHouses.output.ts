import { Field, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { House } from 'src/db_entity/house/entities/house.entity';
import { ImgurlOutput } from './imgUrl.output';

@ObjectType()
export class fetchAllHousesOutput extends OmitType(House, [
  'house_cost',
  'house_location',
  'house_category',
  'region',
  'imgs',
]) {
  @Field(() => Int)
  month_cost: number;

  @Field(() => [String])
  img_urls: string[];

  @Field(() => String)
  nearest_main_spot_name: string;

  @Field(() => String)
  region_name: string;
}
