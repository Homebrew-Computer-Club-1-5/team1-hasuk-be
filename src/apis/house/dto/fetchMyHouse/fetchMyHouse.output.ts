import { Field, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { House_cost } from 'src/db_entity/house_cost/entities/house_cost.entity';
import { House_location } from 'src/db_entity/house_location/entities/house_location.entity';

@ObjectType()
class House_locationExceptId extends OmitType(House_location, ['id']) {}

@ObjectType()
class House_costExceptId extends OmitType(House_cost, ['id']) {}

@ObjectType()
export class FetchMyHouseOutput {
  @Field(() => [String])
  img_urls: string[];

  @Field(() => Int)
  id: number;

  @Field(() => String)
  contact_number: string;

  @Field(() => Int)
  gender: number;

  @Field(() => String)
  house_other_info: string;

  @Field(() => Int)
  region: number;

  @Field(() => House_costExceptId)
  cost: House_costExceptId;

  @Field(() => Int)
  house_category: number;

  @Field(() => House_locationExceptId)
  location: House_locationExceptId;

  @Field(() => Number)
  board_date: number;
}
