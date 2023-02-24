import { Field, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { House } from 'src/db_entity/house/entities/house.entity';
import { CategoryOutput } from '../fetchAllHousesGroupedByRegion/fetchAllHouses_category.output';
import { ImgOutput } from '../fetchAllHousesGroupedByRegion/fetchAllHouse_house_img.output';
import { RegionOutput } from './fetchHouse_region.output';

@ObjectType()
export class FetchHouseOutput extends OmitType(House, [
  'house_category',
  'region',
  'imgs',
]) {
  @Field(() => CategoryOutput)
  house_category: CategoryOutput;

  @Field(() => RegionOutput, { nullable: true })
  region: RegionOutput;

  @Field(() => [ImgOutput])
  imgs: ImgOutput[];

}
