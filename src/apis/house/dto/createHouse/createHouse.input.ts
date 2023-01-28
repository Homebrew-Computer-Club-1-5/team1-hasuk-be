import { Field, InputType, Int } from '@nestjs/graphql';
import { House_costInput } from 'src/apis/house/dto/createHouse/createHouse.house_cost.input';
import { House_locationInput } from 'src/apis/house/dto/createHouse/createHouse.house_location.input';
import { HouseInput } from './createHouse.house.input';

@InputType()
export class CreateHouseInput {
  @Field(() => HouseInput)
  house: HouseInput;

  @Field(() => House_locationInput)
  house_location: House_locationInput;

  @Field(() => House_costInput)
  house_cost: House_costInput;

  @Field(() => Int)
  university_id: number;

  @Field(() => Int)
  region_id: number;

  @Field(() => Int)
  house_category_id: number;

  @Field(() => [String])
  imgRawDatas: string[]; // 수정 필요
}
