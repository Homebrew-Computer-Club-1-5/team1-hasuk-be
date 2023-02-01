import { Field, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { House_location } from 'src/db_entity/house_location/entities/house_location.entity';

@ObjectType()
class House_locationExceptId extends OmitType(House_location, ['id']) {}

@ObjectType()
export class FetchMyHouseOutput {
  @Field(() => [String])
  img_urls: string[];

  //   @Field(() => [ImgurlOutput])
  //   img_urls: JSON;

  @Field(() => String)
  contact_number: string;

  @Field(() => House_locationExceptId)
  location: House_locationExceptId;

  @Field(() => Number)
  boardDate: number;
}
