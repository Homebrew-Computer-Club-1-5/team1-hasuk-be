import { Field, InputType, Int, OmitType } from '@nestjs/graphql';
import { CreateHouseInput } from '../createHouse/createHouse.input';

// @InputType()
// export class UpdateMyHouseInput extends CreateHouseInput {
//   @Field(() => Int)
//   house_id: number;
// }

@InputType()
export class UpdateMyHouseInput extends OmitType(CreateHouseInput, [
  'imgRawDatas',
]) {
  @Field(() => Int)
  house_id: number;
}
