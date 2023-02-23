import { Field, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { House_cost } from 'src/db_entity/house_cost/entities/house_cost.entity';
import { House_location } from 'src/db_entity/house_location/entities/house_location.entity';

@ObjectType()
class House_locationExceptId extends OmitType(House_location, ['id']) {}

@ObjectType()
class House_costExceptId extends OmitType(House_cost, ['id']) {}

@ObjectType()
export class FetchMyHouseOutput {
  @Field(() => [String], { nullable: true })
  img_urls: string[];

  @Field(() => Int)
  id: number;

  @Field(() => String)
  contact_number: string;

  @Field(() => Int, { nullable: true })
  gender: number;

  @Field(() => String, { nullable: true })
  house_other_info: string;

  @Field(() => Int, { nullable: true })
  region: number;

  @Field(() => House_costExceptId, { nullable: true })
  cost: House_costExceptId;

  @Field(() => Int, { nullable: true })
  house_category: number;

  @Field(() => House_locationExceptId, { nullable: true })
  location: House_locationExceptId;

  @Field(() => Number, { nullable: true })
  board_date: number;
}
