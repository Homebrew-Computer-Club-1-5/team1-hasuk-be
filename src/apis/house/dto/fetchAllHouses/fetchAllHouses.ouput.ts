import { Field, Int, ObjectType, OmitType } from '@nestjs/graphql';
import { House } from 'src/db_entity/house/entities/house.entity';

@ObjectType()
export class fetchAllHouses extends House {
  @Field(()=>Int)
  is_wished: number;
}
