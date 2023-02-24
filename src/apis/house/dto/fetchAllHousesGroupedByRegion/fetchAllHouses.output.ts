import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import { Region } from 'src/db_entity/region/entities/region.entity';
import { HouseOutput } from './fetchAllHouses_house.output';
import { UniversitiyOutput } from './fetchAllHouse_univiersity.output';

@ObjectType()
export class fetchAllHousesGroupedByRegionOutput extends OmitType(Region, [
  'universities',
  'houses',
]) {
  @Field(() => UniversitiyOutput)
  universities: UniversitiyOutput;

  @Field(() => [HouseOutput])
  houses: HouseOutput[];
}
